<template>
	<Dialog v-model:open="isOpen">
		<DialogTrigger><Button>Create Category</Button></DialogTrigger>
		<DialogContent>
			<form @submit.prevent="handleCategoryCreate">
				<DialogHeader>
					<DialogTitle>Create Category</DialogTitle>
					<DialogDescription>Create a new category</DialogDescription>
				</DialogHeader>
				<div class="grid gap-4 py-4">
					<div class="grid grid-cols-4 items-center gap-4">
						<Label for="name_en" class="text-right"
							>English Name</Label
						>
						<Input
							id="name_en"
							v-model="name_en"
							class="col-span-3"
						/>
					</div>
					<div class="grid grid-cols-4 items-center gap-4">
						<Label for="name_km" class="text-right"
							>Khmer Name</Label
						>
						<Input
							id="name_km"
							v-model="name_km"
							class="col-span-3"
						/>
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
const supabase = useSupabaseClient<Category>();
const name_en = ref("");
const name_km = ref("");
const errorMessage = ref("");
const status = ref<FetchStatus>("idle");
const emit = defineEmits(["success"]);

const validateForm = () => {
	if (!name_en.value.trim()) {
		errorMessage.value = "English name is required";
		return false;
	}
	if (!name_km.value.trim()) {
		errorMessage.value = "Khmer name is required";
		return false;
	}
	return true;
};

const checkDuplicateCategory = async () => {
	// Check for duplicate English name
	const { data: dataEn } = await supabase
		.from("categories")
		.select("id")
		.eq("name_en", name_en.value.trim())
		.maybeSingle();

	if (dataEn) {
		errorMessage.value = "A category with this English name already exists";
		return true;
	}

	// Check for duplicate Khmer name
	const { data: dataKm } = await supabase
		.from("categories")
		.select("id")
		.eq("name_km", name_km.value.trim())
		.maybeSingle();

	if (dataKm) {
		errorMessage.value = "A category with this Khmer name already exists";
		return true;
	}

	return false;
};

const handleCategoryCreate = async () => {
	// Reset error message
	errorMessage.value = "";

	// Validate form
	if (!validateForm()) {
		return;
	}

	// Set status to pending
	status.value = "pending";

	try {
		// Check for duplicate category names
		const isDuplicate = await checkDuplicateCategory();
		if (isDuplicate) {
			status.value = "idle";
			return;
		}

		// Create category if no duplicate
		const { data, error } = await supabase
			.from("categories")
			.insert({
				name_en: name_en.value.trim(),
				name_km: name_km.value.trim(),
			})
			.select("id, name_en, name_km")
			.single();

		if (data) {
			// Success
			status.value = "idle";
			isOpen.value = false;
			name_en.value = ""; // Reset form
			name_km.value = ""; // Reset form
			emit("success", data);
		}

		if (error) {
			errorMessage.value = "Unable to create category";
			console.error("Error creating category:", error);
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
