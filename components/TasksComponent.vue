<template>
    
    <div class="container mx-auto pt-10">
        <v-card class="rounded-0 w-12" id="card__tasks">

            <v-card class="d-flex flex-row-reverse mb-6 pa-4 rounded-0" variant="tonal">

                <v-btn variant="tonal" class="ma-2 btn__delete" color="red-darken-1" 
                    prepend-icon="mdi-delete" 
                    @click="handleDeleteSelectedTask">
                    Tasks
                </v-btn>

                <v-btn variant="tonal" class="ma-2 btn__delete" color="red-darken-1" 
                    v-if="selectedTasks.filter((item, idx) => item.status.done == false).length > 0" 
                    prepend-icon="mdi-delete" 
                    @click="handleTaskDone">
                    Tasks Done
                </v-btn>

                <v-chip
                    class="ma-2 bg-indigo"
                    text-color="white"
                    :model-value="true"
                    >
                    Tasks Done

                    <span class="myBadge">
                        {{selectedTasks.filter((item, idx) => item.status.done == false).length}}</span>
                    
                </v-chip>

                <v-chip
                    class="ma-2 bg-indigo"
                    text-color="white"
                    :model-value="true">
                    Tasks

                    <span class="myBadge">
                        {{tasks.filter((item, idx) => item.status.done == false).length}}</span>
                    
                </v-chip>
            
            </v-card>

            <v-card v-if="tasks.length < 1" text="No tasks to display." class="ma-3 pa-2" variant="outlined"></v-card>

            <v-card v-if="tasks.length > 0" class="ma-3 pa-2 elevation-3" 
                v-for="(item, idx) in tasks.filter((item, idx) => item.status.done == false)" :key="item.id">
                <v-checkbox 
                    @update:model-value="handleCheckboxUpdate"
                    v-model="selectedTasks"
                    :value="item"
                    :disabled="item.status.done"
                    :label="item.label"
                    color="success"
                    hide-details>
                
                </v-checkbox>
                    <v-btn 
                        @click="handleTaskDelete(item.id)"
                        color="red-lighten-2"
                        variant="tonal" 
                        class="rounded-100 list__btn-delete">
                        <v-icon icon="mdi-delete"></v-icon>
                    </v-btn>
            </v-card>

            

            <v-card class="pa-4 rounded-0" :style="{'background': '#E4E4E4'}">
                <v-text-field theme="light" 
                    v-model="inputTask"
                    :hide-details="true"
                    variant="solo"
                    rounded="pill"
                    placeholder="New task">
                    <template v-slot:append-inner>
                        <v-col cols="auto">
                            <v-btn @click="handleFormSubmit"
                            :style="{'background': '#283593','color':'#ffffff'}"
                            variant="tonal" 
                            density="compact" 
                            icon="mdi-plus"></v-btn>
                          </v-col>
                    </template>
                </v-text-field>
            </v-card>
            
        </v-card>

    </div>

</template>
<script setup lang="ts">

    type Task  = {
        id: number
        label: string,
        status: {
            done: boolean
        }
    }

    const taskStore = useTaskStore();

    const tasks = ref<Task[]>([]);
    const inputTask = ref<string>("");
    const selectedTasks = ref<Task[]>([]);

    const updateStore = () => {
        taskStore.setTasks(JSON.stringify(tasks.value));
        taskStore.setSelectedTasks(JSON.stringify(selectedTasks.value));
    }

    const handleFormSubmit = () : void => {
        
        if( inputTask.value == "") return;

        const task : Task = {
            id: new Date().getTime(),
            label: inputTask.value,
            status: {
                done: false
            }
        }

        tasks.value.push(task)
        taskStore.createTask(JSON.stringify(tasks.value));
        inputTask.value = "";
    }

    const handleTaskDone = () => {
        
        selectedTasks.value.forEach((item:Task, val:number) => {
            tasks.value.forEach((tItem:Task, tIdx:number) => {
                if (tItem.id === item.id) tItem.status.done = true;
            });
        });

        selectedTasks.value = [];

        updateStore();

    }

    const handleTaskDelete = (id:number) => {
        tasks.value.forEach(
            (item, idx) => item.id === id ? tasks.value.splice(idx, 1) : '');
        
        selectedTasks.value.forEach(
            (item, idx) => item.id === id ? selectedTasks.value.splice(idx, 1) : '');

        updateStore();
    }

    const handleDeleteSelectedTask= () => {
        
        selectedTasks.value.forEach((item, idx) => {
            tasks.value.forEach((tItems:Task, tIdx:number) => {
                if(item.id === tItems.id) tasks.value.splice(tIdx, 1);
            });
            selectedTasks.value = [];
        });

        updateStore();
    }

    const handleCheckboxUpdate = () => {
        setTimeout(() => {
            const data = JSON.stringify(selectedTasks.value);
            taskStore.setSelectedTasks(data);
        }, 500);
    }

    const getAndSetSelected = () => {
        setTimeout(() => {
            const response = taskStore.fetchSelectedTasks();
            selectedTasks.value.push(...response);
        }, 1000);
    }

    const getTasks = () => {
        setTimeout(() => {
            const response = taskStore.fetchTasks();
            tasks.value.push(...response);
        }, 1000);
    }

    onBeforeMount(async () => {
        await getTasks();
        await getAndSetSelected();
    });

</script>

<style scoped lang="scss">

.myBadge {
    align-items: center;
    display: inline-flex;
    border-radius: 10px;
    font-size: 0.75rem;
    font-weight: 500;
    height: 1.25rem;
    justify-content: center;
    min-width: 20px;
    padding: 4px 6px;
    pointer-events: auto;
    position: relative;
    right: -5px;
    top: 25%;
    text-align: center;
    text-indent: 0;
    transition: 0.225s cubic-bezier(0.4, 0, 0.2, 1);
    white-space: nowrap;
    color: #283593;
    background: #ffffff;
  }

.btn--indigo {
    background: #283593;
    color: #ffffff;
}

.bg-indigo {
    background: #283593;
}

.text-indigo {
    color: #283593;
}

.btn-submit {
    min-width: 36px !important;
    padding: 0;
    border-radius:28px!important;
}

.btn__delete {
    text-transform: capitalize;
}

#card__tasks {
    min-width: 640px !important;
}

.relative-right {
    position: relative;
    right: -10px;
}

.list__btn-delete {
    position: absolute;
    top: 25%;
    right: 2%;
}

.my-badge {
    span.v-badge__badge.v-theme--light {
        background: #ffffff !important;
    }
}

</style>