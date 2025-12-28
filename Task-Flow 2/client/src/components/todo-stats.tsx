import { type Todo } from "@shared/schema";
import { motion } from "framer-motion";

interface TodoStatsProps {
  todos: Todo[];
}

export function TodoStats({ todos }: TodoStatsProps) {
  const total = todos.length;
  const completed = todos.filter(t => t.completed).length;
  const percentage = total === 0 ? 0 : Math.round((completed / total) * 100);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex items-center justify-between mb-8 px-2"
    >
      <div>
        <h2 className="text-2xl font-bold font-display text-foreground">My Tasks</h2>
        <p className="text-muted-foreground text-sm mt-1">
          {completed} of {total} completed
        </p>
      </div>
      
      <div className="flex items-center gap-3">
        <div className="text-right">
          <span className="text-2xl font-bold text-primary font-display">{percentage}%</span>
        </div>
        <div className="w-12 h-12 relative flex items-center justify-center">
          <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 36 36">
            <path
              className="text-muted"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              fill="none"
              stroke="currentColor"
              strokeWidth="4"
            />
            <motion.path
              className="text-primary"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: percentage / 100 }}
              transition={{ duration: 1, ease: "easeOut" }}
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              fill="none"
              stroke="currentColor"
              strokeWidth="4"
              strokeDasharray="100, 100"
            />
          </svg>
        </div>
      </div>
    </motion.div>
  );
}
