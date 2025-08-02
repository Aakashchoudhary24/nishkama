"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { MoreVertical, Edit2, Check, Trash2 } from "lucide-react";

type Task = {
  text: string;
  priority: "High" | "Medium" | "Low";
  done: boolean;
};

const PRIORITIES: Task["priority"][] = ["High", "Medium", "Low"];

export default function TaskTracker() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState("");
  const [priority, setPriority] = useState<Task["priority"]>("High");
  const [menuOpen, setMenuOpen] = useState<number | null>(null);

  // Load tasks from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("tasks");
    if (saved) setTasks(JSON.parse(saved));
  }, []);

  // Save tasks to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  const addTask = () => {
    if (!newTask.trim()) return;
    setTasks([...tasks, { text: newTask.trim(), priority, done: false }]);
    setNewTask("");
  };

  const toggleDone = (i: number) => {
    setTasks((prev) =>
      prev.map((task, idx) => (idx === i ? { ...task, done: !task.done } : task))
    );
    setMenuOpen(null);
  };

  const deleteTask = (i: number) => {
    setTasks((prev) => prev.filter((_, idx) => idx !== i));
    setMenuOpen(null);
  };

  const editTask = (i: number) => {
    const newName = prompt("Edit task:", tasks[i].text);
    if (newName && newName.trim()) {
      setTasks((prev) =>
        prev.map((task, idx) =>
          idx === i ? { ...task, text: newName.trim() } : task
        )
      );
    }
    setMenuOpen(null);
  };

  const priorityColor = (priority: Task["priority"]) => {
    switch (priority) {
      case "High":
        return "bg-red-500 text-white";
      case "Medium":
        return "bg-yellow-400 text-black";
      case "Low":
        return "bg-green-500 text-white";
    }
  };

  return (
    <main className="max-w-3xl mx-auto p-6 space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold tracking-tight">Task Manager</h1>
        <p className="text-gray-500">Organize and prioritize your work</p>
      </div>

      {/* Add Task Form */}
      <div className="flex flex-col sm:flex-row gap-2">
        <Input
          placeholder="Enter a new task..."
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
        />
        <Select
          value={priority}
          onValueChange={(v: Task["priority"]) => setPriority(v)}
        >
          <SelectTrigger className="w-full sm:w-40">
            <SelectValue placeholder="Priority" />
          </SelectTrigger>
          <SelectContent>
            {PRIORITIES.map((p) => (
              <SelectItem key={p} value={p}>
                {p}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button onClick={addTask}>Add Task</Button>
      </div>

      {/* Task Sections */}
      {PRIORITIES.map((level) => (
        <div key={level} className="space-y-2 relative">
          <h2 className="text-2xl font-semibold mt-6 flex items-center gap-2">
            <Badge className={priorityColor(level)}>{level} Priority</Badge>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {tasks
              .filter((t) => t.priority === level)
              .map((task, i) => {
                const index = tasks.indexOf(task);
                return (
                  <Card
                    key={index}
                    className={`p-4 shadow-sm relative ${
                      task.done
                        ? "bg-muted text-muted-foreground line-through"
                        : "bg-white"
                    }`}
                  >
                    {/* First row: text + menu */}
                    <div className="flex justify-between items-start">
                      <CardContent
                        className="p-0 flex-grow cursor-pointer text-base"
                        onClick={() => toggleDone(index)}
                      >
                        {task.text}
                      </CardContent>

                      <div className="relative">
                        <button
                          onClick={() =>
                            setMenuOpen(menuOpen === index ? null : index)
                          }
                          className="p-1 hover:bg-gray-100 rounded"
                        >
                          <MoreVertical className="w-5 h-5" />
                        </button>

                        {menuOpen === index && (
                          <div className="absolute right-0 top-full mt-1 w-32 bg-white border rounded shadow z-10">
                            <button
                              onClick={() => editTask(index)}
                              className="flex items-center gap-2 px-2 py-1 w-full text-left hover:bg-gray-100"
                            >
                              <Edit2 size={16} /> Edit
                            </button>
                            <button
                              onClick={() => toggleDone(index)}
                              className="flex items-center gap-2 px-2 py-1 w-full text-left hover:bg-gray-100"
                            >
                              <Check size={16} />{" "}
                              {task.done ? "Undo" : "Mark Done"}
                            </button>
                            <button
                              onClick={() => deleteTask(index)}
                              className="flex items-center gap-2 px-2 py-1 w-full text-left text-red-500 hover:bg-gray-100"
                            >
                              <Trash2 size={16} /> Delete
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </Card>
                );
              })}
          </div>
        </div>
      ))}
    </main>
  );
}
