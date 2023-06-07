<script>
import { onMounted } from 'vue'

export default defineComponent({
    setup() {
        const downloadFileATag = ref(null)
        onMounted(() => {
            console.log(downloadFileATag.value)
        })
    }
})
</script>





