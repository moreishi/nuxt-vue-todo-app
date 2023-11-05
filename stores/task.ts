import { defineStore } from 'pinia';

export const useTaskStore = defineStore('task', () => {

    const fetchTasks = () => {
        const response = localStorage.getItem('tasks') || '[]';
        return JSON.parse(response);
    }

    const fetchSelectedTasks = () => {
        const response = localStorage.getItem('selected_tasks') || '[]';
        return JSON.parse(response);
    }

    const createTask = (tasks:string) => {
        localStorage.setItem('tasks', tasks);
    }

    const setSelectedTasks = (data:string) => {
        localStorage.setItem('selected_tasks', data)
    }

    const setTasks = (data:string) => {
        localStorage.setItem('tasks', data)
    }

    return { 
        createTask,
        fetchTasks,
        fetchSelectedTasks,
        setSelectedTasks,
        setTasks
    }

});