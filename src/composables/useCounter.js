import { ref, computed } from 'vue';
import { incrementHour } from 'vuetify/lib/components/VTimePicker/util.mjs';

export function useCounter(inialValue = 0){
    const count = ref(inialValue);
    const doubleCount = computed(() => count.value * 2);
    function increment(){
        count.value++;
    }
    function decrement(){
        count.value--;
    }

    return {
        count,
        doubleCount,
        increment,
        decrement
    }
}


// 使い方
//<template>
//    <div>
//        <h2>カウンター</h2>
//        <p>Count: {{ count}}</p>
//        <p>Double Count: {{ doubleCount}}</p>
//        <button @click="increment">increment</button>
//        <button @click="decrement">Decrement</button>
//    </div>
//</template>

//<script setup>
//import { useCounter } from '@/composables/useCounter';
//const { count, doubleCount, increment, decrement} = useCounter(10);

//</script>
