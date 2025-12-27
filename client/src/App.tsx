import { useState, useEffect } from "react";
import { Plus, Trash2, Sun, Moon, Calendar as CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useToast } from "@/hooks/use-toast";
import { ThemeProvider, useTheme } from "./hooks/use-theme";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface Todo {
  id: number;
  text: string;
  completed: boolean;
  date: string; // ISO date string (YYYY-MM-DD)
}

function TodoApp() {
  const [todos, setTodos] = useState<Todo[]>(() => {
    const saved = localStorage.getItem("todos");
    if (saved) {
      const parsed = JSON.parse(saved);
      // Migrate old todos without dates to today's date
      return parsed.map((todo: any) => ({
        ...todo,
        date: todo.date || format(new Date(), "yyyy-MM-dd"),
      }));
    }
    return [];
  });
  const [inputValue, setInputValue] = useState("");
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [viewDate, setViewDate] = useState<Date>(new Date());

  // Update selectedDate when viewDate changes (for better UX)
  useEffect(() => {
    setSelectedDate(viewDate);
  }, [viewDate]);
  const { theme, setTheme } = useTheme();
  const { toast } = useToast();

  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todos));
  }, [todos]);

  const addTodo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const dateString = format(selectedDate, "yyyy-MM-dd");
    const newTodo: Todo = {
      id: Date.now(),
      text: inputValue.trim(),
      completed: false,
      date: dateString,
    };

    setTodos([...todos, newTodo]);
    setInputValue("");
    toast({
      title: "Task added",
      description: `Task added for ${format(selectedDate, "MMM d, yyyy")}`,
    });
  };

  const toggleTodo = (id: number) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const deleteTodo = (id: number) => {
    setTodos(todos.filter((todo) => todo.id !== id));
    toast({
      title: "Task deleted",
      variant: "destructive",
    });
  };

  // Group todos by date
  const todosByDate = todos.reduce((acc, todo) => {
    const date = todo.date;
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(todo);
    return acc;
  }, {} as Record<string, Todo[]>);

  // Get dates that have tasks (as Date objects for calendar modifiers)
  const datesWithTasks = Object.keys(todosByDate).map((dateStr) => {
    const [year, month, day] = dateStr.split("-").map(Number);
    return new Date(year, month - 1, day);
  });

  // Sort dates
  const sortedDates = Object.keys(todosByDate).sort((a, b) => 
    new Date(a).getTime() - new Date(b).getTime()
  );

  // Get todos for the selected view date
  const viewDateString = format(viewDate, "yyyy-MM-dd");
  const todosForViewDate = todosByDate[viewDateString] || [];

  return (
    <div className="min-h-screen bg-background p-4 md:p-8 transition-colors duration-300">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Task Calendar</h1>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="rounded-full"
            data-testid="button-theme-toggle"
          >
            {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Calendar Section */}
          <Card className="shadow-lg border-muted">
            <CardHeader>
              <CardTitle className="text-xl">Calendar</CardTitle>
            </CardHeader>
            <CardContent>
              <Calendar
                mode="single"
                selected={viewDate}
                onSelect={(date: Date | undefined) => date && setViewDate(date)}
                modifiers={{
                  hasTasks: datesWithTasks,
                }}
                modifiersClassNames={{
                  hasTasks: "bg-primary/20 text-primary font-semibold rounded-md",
                }}
                className="rounded-md border"
              />
              <div className="mt-4 pt-4 border-t">
                <p className="text-sm text-muted-foreground mb-2">
                  Selected: <span className="font-medium">{format(viewDate, "EEEE, MMMM d, yyyy")}</span>
                </p>
                <p className="text-xs text-muted-foreground">
                  {todosForViewDate.length} task{todosForViewDate.length !== 1 ? "s" : ""} on this date
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Tasks Section */}
          <Card className="shadow-lg border-muted">
            <CardHeader>
              <CardTitle className="text-xl">Tasks for {format(viewDate, "MMM d, yyyy")}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Add Task Form */}
              <form onSubmit={addTodo} className="space-y-3">
                <Input
                  placeholder="What needs to be done?"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  className="flex-1"
                  data-testid="input-todo"
                />
                <div className="flex gap-2">
                  <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        type="button"
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !selectedDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {selectedDate ? format(selectedDate, "MMM d, yyyy") : "Pick a date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={selectedDate}
                        onSelect={(date: Date | undefined) => {
                          if (date) {
                            setSelectedDate(date);
                            setCalendarOpen(false);
                          }
                        }}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <Button type="submit" size="icon" className="shrink-0" data-testid="button-add">
                    <Plus className="h-5 w-5" />
                  </Button>
                </div>
              </form>

              {/* Tasks List */}
              <div className="space-y-3">
                {todosForViewDate.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8 text-sm italic">
                    No tasks for this date. Add one above!
                  </p>
                ) : (
                  todosForViewDate.map((todo) => (
                    <div
                      key={todo.id}
                      className="flex items-center justify-between p-3 rounded-lg border border-transparent bg-muted/30 hover:bg-muted/50 transition-colors group"
                      data-testid={`todo-item-${todo.id}`}
                    >
                      <div className="flex items-center gap-3">
                        <Checkbox
                          checked={todo.completed}
                          onCheckedChange={() => toggleTodo(todo.id)}
                          data-testid={`checkbox-todo-${todo.id}`}
                        />
                        <span
                          className={`text-sm font-medium transition-all duration-300 ${
                            todo.completed
                              ? "line-through text-muted-foreground opacity-60"
                              : "text-foreground"
                          }`}
                        >
                          {todo.text}
                        </span>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => deleteTodo(todo.id)}
                        className="h-8 w-8 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                        data-testid={`button-delete-${todo.id}`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))
                )}
              </div>

              {/* All Tasks Summary */}
              {sortedDates.length > 0 && (
                <div className="pt-4 border-t space-y-4">
                  <div className="flex justify-between items-center text-xs text-muted-foreground">
                    <span>{todos.filter(t => !t.completed).length} items left</span>
                    <span>{todos.length} total</span>
                  </div>
                  
                  {/* Tasks by Date Summary */}
                  <div className="space-y-2">
                    <p className="text-xs font-medium text-muted-foreground">Tasks by Date:</p>
                    <div className="space-y-1 max-h-40 overflow-y-auto">
                      {sortedDates.map((dateStr) => {
                        const dateTodos = todosByDate[dateStr];
                        const incompleteCount = dateTodos.filter(t => !t.completed).length;
                        const isSelected = dateStr === viewDateString;
                        return (
                          <button
                            key={dateStr}
                            onClick={() => setViewDate(new Date(dateStr))}
                            className={cn(
                              "w-full text-left px-2 py-1 rounded text-xs transition-colors",
                              isSelected
                                ? "bg-primary/20 text-primary font-medium"
                                : "hover:bg-muted/50 text-muted-foreground"
                            )}
                          >
                            {format(new Date(dateStr), "MMM d, yyyy")} - {dateTodos.length} task{dateTodos.length !== 1 ? "s" : ""}
                            {incompleteCount > 0 && ` (${incompleteCount} incomplete)`}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="todo-theme">
      <TodoApp />
    </ThemeProvider>
  );
}
