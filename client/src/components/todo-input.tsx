import { useState } from "react";
import { Plus } from "lucide-react";
import { useCreateTodo } from "@/hooks/use-todos";
import { motion } from "framer-motion";

export function TodoInput() {
  const [text, setText] = useState("");
  const createTodo = useCreateTodo();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;
    
    createTodo.mutate(
      { text, completed: false },
      { onSuccess: () => setText("") }
    );
  };

  return (
    <motion.form 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      onSubmit={handleSubmit} 
      className="relative group mb-8"
    >
      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
        <Plus className={`h-6 w-6 transition-colors duration-200 ${text ? 'text-primary' : 'text-muted-foreground'}`} />
      </div>
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        disabled={createTodo.isPending}
        placeholder="Add a new task..."
        className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white border-2 border-transparent shadow-lg shadow-black/5 
                   text-lg placeholder:text-muted-foreground/70 outline-none
                   focus:border-primary/20 focus:ring-4 focus:ring-primary/10 focus:shadow-xl
                   transition-all duration-300"
      />
      <div className="absolute inset-y-0 right-2 flex items-center">
        <button
          type="submit"
          disabled={!text.trim() || createTodo.isPending}
          className="px-4 py-2 bg-primary text-primary-foreground font-medium rounded-xl text-sm
                     opacity-0 scale-90 translate-x-4 group-focus-within:opacity-100 group-focus-within:scale-100 group-focus-within:translate-x-0
                     disabled:opacity-50 disabled:cursor-not-allowed
                     hover:bg-primary/90 hover:shadow-md hover:shadow-primary/20 transition-all duration-200 ease-out"
        >
          {createTodo.isPending ? "Adding..." : "Add Task"}
        </button>
      </div>
    </motion.form>
  );
}
