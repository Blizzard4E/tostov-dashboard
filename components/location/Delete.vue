<template>
	<Dialog v-model:open="isOpen">
		<DialogTrigger>
			<Button size="icon" variant="destructive"
				><component :is="Trash"
			/></Button>
		</DialogTrigger>
		<DialogContent>
			<DialogHeader>
				<DialogTitle>Delete Location</DialogTitle>
				<DialogDescription>
					Are you sure you want to delete location:
					<strong>{{ location.name_en }}</strong
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
	location: {
		id: number;
		name_en: string;
		name_km: string;
	};
}>();

const emit = defineEmits(["success"]);
const isOpen = ref(false);
const supabase = useSupabaseClient<Location>();
const errorMessage = ref("");
const status = ref<FetchStatus>("idle");

const handleDelete = async () => {
	status.value = "pending";
	errorMessage.value = "";

	try {
		// First delete location_tags relationships
		const { error: tagRelationError } = await supabase
			.from("location_tags")
			.delete()
			.eq("location_id", props.location.id);

		if (tagRelationError) {
			throw tagRelationError;
		}

		// Then delete the location itself
		const { error } = await supabase
			.from("locations")
			.delete()
			.eq("id", props.location.id);

		if (error) {
			throw error;
		}

		// Success
		isOpen.value = false;
		status.value = "idle";

		// Emit delete event
		emit("success", props.location.id);
	} catch (error) {
		console.error("Error deleting location:", error);
		errorMessage.value = "Failed to delete location";
		status.value = "idle";
	}
};
</script>

<style></style>
