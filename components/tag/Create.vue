<template>
	<Dialog v-model:open="isOpen">
		<DialogTrigger><Button>Create Tag</Button></DialogTrigger>
		<DialogContent>
			<form @submit.prevent="handleTagCreate">
				<DialogHeader>
					<DialogTitle>Create Tag</DialogTitle>
					<DialogDescription>Create a new tag</DialogDescription>
				</DialogHeader>
				<div class="grid gap-4 py-4">
					<div class="grid grid-cols-4 items-center gap-4">
						<Label for="name" class="text-right">Tag Name</Label>
						<Input id="name" v-model="name" class="col-span-3" />
					</div>
				</div>
				<DialogFooter>
					<p class="text-red-500">{{ errorMessage }}</p>
					<Button
						type="submit"
						:disabled="status == 'pending'"
						:status="status"
						>Create</Button
					>
				</DialogFooter>
			</form>
		</DialogContent>
	</Dialog>
</template>
<script lang="ts" setup>
const isOpen = ref();
const supabase = useSupabaseClient<Tag>();
const name = ref("");
const errorMessage = ref("");
const status = ref<FetchStatus>("idle");
const emit = defineEmits(["success"]);

const validateForm = () => {
	if (!name.value.trim()) {
		errorMessage.value = "Tag name is required";
		return false;
	}
	return true;
};

const checkDuplicateTag = async () => {
	const { data, error } = await supabase
		.from("tags")
		.select("id")
		.eq("name", name.value.trim())
		.maybeSingle();

	if (data) {
		errorMessage.value = "A tag with this name already exists";
		return true;
	}

	return false;
};

const handleTagCreate = async () => {
	// Reset error message
	errorMessage.value = "";

	// Validate form
	if (!validateForm()) {
		return;
	}

	// Set status to pending
	status.value = "pending";

	try {
		// Check for duplicate tag
		const isDuplicate = await checkDuplicateTag();
		if (isDuplicate) {
			status.value = "idle";
			return;
		}

		// Create tag if no duplicate
		const { data, error } = await supabase
			.from("tags")
			.insert({
				name: name.value.trim(),
			})
			.select("id, name")
			.single();

		if (data) {
			// Success
			status.value = "idle";
			isOpen.value = false;
			name.value = ""; // Reset form
			emit("success", data);
		}

		if (error) {
			errorMessage.value = "Unable to create tag";
			console.error("Error creating tag:", error);
		}
	} catch (err) {
		errorMessage.value = "An error occurred";
		console.error("Exception:", err);
	} finally {
		status.value = "idle";
	}
};
</script>
<style></style>
