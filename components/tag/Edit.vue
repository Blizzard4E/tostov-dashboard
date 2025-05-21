<template>
	<Dialog v-model:open="isOpen">
		<DialogTrigger>
			<Button size="icon"><component :is="Edit" /></Button>
		</DialogTrigger>
		<DialogContent>
			<form @submit.prevent="handleEdit">
				<DialogHeader>
					<DialogTitle>Edit Tag</DialogTitle>
					<DialogDescription>Update tag name</DialogDescription>
				</DialogHeader>
				<div class="grid gap-4 py-4">
					<div class="grid grid-cols-4 items-center gap-4">
						<Label for="name" class="text-right">Tag Name</Label>
						<Input
							id="name"
							v-model="name"
							class="col-span-3"
							placeholder="Enter tag name"
						/>
					</div>
				</div>
				<DialogFooter>
					<p class="text-red-500">{{ errorMessage }}</p>
					<Button
						type="submit"
						:disabled="status === 'pending'"
						:status="status"
						>Update</Button
					>
				</DialogFooter>
			</form>
		</DialogContent>
	</Dialog>
</template>
<script lang="ts" setup>
import { Edit } from "lucide-vue-next";

const props = defineProps<{
	tag: {
		id: string;
		name: string;
	};
}>();

const isOpen = ref(false);
const supabase = useSupabaseClient<Tag>();
const name = ref(props.tag.name);
const errorMessage = ref("");
const status = ref<FetchStatus>("idle");
const originalValue = ref(props.tag.name);
const emit = defineEmits(["success"]);

// Reset form when tag changes
watch(
	() => props.tag,
	(newTag) => {
		name.value = newTag.name;
		errorMessage.value = "";
		originalValue.value = newTag.name;
	},
	{ deep: true }
);

const validateForm = () => {
	if (!name.value.trim()) {
		errorMessage.value = "Tag name cannot be empty";
		return false;
	}

	// No changes were made
	if (name.value.trim() === originalValue.value) {
		// Just close the dialog without showing an error
		isOpen.value = false;
		return false;
	}

	return true;
};

const checkDuplicateTag = async () => {
	const { data, error } = await supabase
		.from("tags")
		.select("id")
		.eq("name", name.value.trim())
		.neq("id", props.tag.id) // Exclude current tag
		.maybeSingle();

	if (data) {
		errorMessage.value = "A tag with this name already exists";
		return true;
	}

	return false;
};

const handleEdit = async () => {
	if (!validateForm()) {
		return;
	}

	status.value = "pending";
	errorMessage.value = "";

	try {
		// Check for duplicate tag name
		const isDuplicate = await checkDuplicateTag();
		if (isDuplicate) {
			status.value = "idle";
			return;
		}

		// Update tag in database
		const { data, error } = await supabase
			.from("tags")
			.update({ name: name.value.trim() })
			.eq("id", props.tag.id)
			.select("id, name")
			.single();

		if (error) {
			throw error;
		}

		// Success
		isOpen.value = false;
		status.value = "idle";
		originalValue.value = name.value.trim();

		// Emit update event
		emit("success", data);
	} catch (error) {
		errorMessage.value = "Failed to update tag";
		status.value = "idle";
	}
};
</script>
<style></style>
