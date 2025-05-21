<template>
	<Dialog v-model:open="isOpen">
		<DialogTrigger>
			<Button size="icon" variant="destructive"
				><component :is="Trash"
			/></Button>
		</DialogTrigger>
		<DialogContent>
			<DialogHeader>
				<DialogTitle>Delete Category</DialogTitle>
				<DialogDescription>
					Are you sure you want to delete category:
					<strong>{{ category.name_en }}</strong> /
					<strong>{{ category.name_km }}</strong
					>? This action cannot be undone.
				</DialogDescription>
			</DialogHeader>
			<DialogFooter>
				<p class="text-red-500">{{ errorMessage }}</p>
				<div class="flex gap-2">
					<Button variant="outline" @click="isOpen = false"
						>Cancel</Button
					>
					<Button
						variant="destructive"
						:disabled="status === 'pending'"
						@click="handleDelete"
						>Delete</Button
					>
				</div>
			</DialogFooter>
		</DialogContent>
	</Dialog>
</template>
<script lang="ts" setup>
import { Trash } from "lucide-vue-next";

const props = defineProps<{
	category: {
		id: number;
		name_en: string;
		name_km: string;
	};
}>();

const emit = defineEmits(["success"]);
const isOpen = ref(false);
const supabase = useSupabaseClient<Category>();
const errorMessage = ref("");
const status = ref<FetchStatus>("idle");

const handleDelete = async () => {
	status.value = "pending";
	errorMessage.value = "";

	try {
		const { error } = await supabase
			.from("categories")
			.delete()
			.eq("id", props.category.id);

		if (error) {
			throw error;
		}

		// Success
		isOpen.value = false;
		status.value = "idle";

		// Emit delete event
		emit("success", props.category.id);
	} catch (error) {
		errorMessage.value = "Failed to delete category";
		status.value = "idle";
	}
};
</script>
<style></style>
