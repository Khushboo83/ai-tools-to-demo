import { type Todo } from "@shared/schema";
import { useUpdateTodo, useDeleteTodo } from "@/hooks/use-todos";
import { Trash2, Check } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface TodoItemProps {
  todo: Todo;
}

export function TodoItem({ todo }: TodoItemProps) {
  const updateTodo = useUpdateTodo();
  const deleteTodo = useDeleteTodo();

  const toggleComplete = () => {
    updateTodo.mutate({ id: todo.id, completed: !todo.completed });
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ scale: 1.01 }}
      className={cn(
        "group flex items-center gap-4 p-4 rounded-xl border border-border/40 bg-card shadow-sm transition-all duration-200",
        todo.completed ? "bg-muted/30 border-transparent shadow-none" : "hover:border-primary/20 hover:shadow-md hover:shadow-black/5"
      )}
    >
      <button
        onClick={toggleComplete}
        className={cn(
          "relative flex-shrink-0 w-6 h-6 rounded-full border-2 transition-all duration-300 flex items-center justify-center",
          todo.completed 
            ? "bg-primary border-primary text-primary-foreground" 
            : "border-muted-foreground/30 hover:border-primary"
        )}
      >
        <motion.div
          initial={false}
          animate={{ scale: todo.completed ? 1 : 0 }}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
        >
          <Check className="w-3.5 h-3.5 stroke-[3px]" />
        </motion.div>
      </button>

      <span 
        className={cn(
          "flex-grow text-lg transition-all duration-300 select-none cursor-pointer",
          todo.completed ? "text-muted-foreground line-through decoration-muted-foreground/50" : "text-foreground font-medium"
        )}
        onClick={toggleComplete}
      >
        {todo.text}
      </span>

      <button
        onClick={() => deleteTodo.mutate(todo.id)}
        disabled={deleteTodo.isPending}
        className="opacity-0 group-hover:opacity-100 p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-all duration-200"
        aria-label="Delete todo"
      >
        <Trash2 className="w-5 h-5" />
      </button>
    </motion.div>
  );
}
