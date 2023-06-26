<style>
.disabled-events {
    cursor: default;
    pointer-events: none;
}
</style>

<template>
    <div id="bottom-navigation-app-window"
        :class="['d-flex align-center', {'disabled-events': drag}]"
        style="overflow: hidden"
        v-dragscroll.x
        @dragscrollstart="drag = true"
        @dragscrollend="drag = false">
            <div v-for="(w, i) in windows"
                :key="i">
                <app-window-item v-if="!w.closed" :data="w" />
            </div>
    </div>
</template>

<script>
import AppWindowItem from './AppWindowItem.vue';

export default {
    props: ['value'],
    components: {
        'app-window-item': AppWindowItem
    },
    created() {
        this.$adm.$on('openNewWindow', (data) => {
            data.id = this.windows.length + 1;
            data.closed = false;
            this.windows.push(data);
        });

        this.$adm.$on('closeWindow', (id) => {
            for (let i in this.windows) {
                if (this.windows[i].id == id) {
                    // this.windows.splice(i, 1);
                    this.windows[i].closed = true;
                    this.allClosedWindows();
                    
                    break;
                }
            }
        })
    },
    data() {
        return {
            windows: [],
            drag: false
        }
    },
    methods: {
        allClosedWindows() {
            let w = [];

            for (let i in this.windows) {
                w.push((this.windows[i].closed
                    ? 1
                    : 0));
            }

            if (w.indexOf(0) == -1) {
                this.windows = [];
            }
        }
    },
    watch: {
        windows(e) {
            if (e.length) {
                this.$emit('input', true);
            } else {
                this.$emit('input', false);
            }
        }
    }
}
</script>