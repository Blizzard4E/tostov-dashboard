<template>
	<Dialog v-model:open="isOpen">
		<DialogTrigger>
			<Button size="icon"><component :is="Edit" /></Button>
		</DialogTrigger>
		<DialogContent>
			<form @submit.prevent="handleEdit">
				<DialogHeader>
					<DialogTitle>Edit Category</DialogTitle>
					<DialogDescription>Update category names</DialogDescription>
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
							placeholder="Enter English name"
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
							placeholder="Enter Khmer name"
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
	category: {
		id: number;
		name_en: string;
		name_km: string;
	};
}>();

const isOpen = ref(false);
const supabase = useSupabaseClient<Category>();
const name_en = ref(props.category.name_en);
const name_km = ref(props.category.name_km);
const errorMessage = ref("");
const status = ref<FetchStatus>("idle");
const originalValueEn = ref(props.category.name_en);
const originalValueKm = ref(props.category.name_km);
const emit = defineEmits(["success"]);

// Reset form when category changes
watch(
	() => props.category,
	(newCategory) => {
		name_en.value = newCategory.name_en;
		name_km.value = newCategory.name_km;
		errorMessage.value = "";
		originalValueEn.value = newCategory.name_en;
		originalValueKm.value = newCategory.name_km;
	},
	{ deep: true }
);

const validateForm = () => {
	if (!name_en.value.trim()) {
		errorMessage.value = "English name cannot be empty";
		return false;
	}

	if (!name_km.value.trim()) {
		errorMessage.value = "Khmer name cannot be empty";
		return false;
	}

	// No changes were made
	if (
		name_en.value.trim() === originalValueEn.value &&
		name_km.value.trim() === originalValueKm.value
	) {
		// Just close the dialog without showing an error
		isOpen.value = false;
		return false;
	}

	return true;
};

const checkDuplicateCategory = async () => {
	// Only check English name if it was changed
	if (name_en.value.trim() !== originalValueEn.value) {
		const { data: dataEn } = await supabase
			.from("categories")
			.select("id")
			.eq("name_en", name_en.value.trim())
			.neq("id", props.category.id) // Exclude current category
			.maybeSingle();

		if (dataEn) {
			errorMessage.value =
				"A category with this English name already exists";
			return true;
		}
	}

	// Only check Khmer name if it was changed
	if (name_km.value.trim() !== originalValueKm.value) {
		const { data: dataKm } = await supabase
			.from("categories")
			.select("id")
			.eq("name_km", name_km.value.trim())
			.neq("id", props.category.id) // Exclude current category
			.maybeSingle();

		if (dataKm) {
			errorMessage.value =
				"A category with this Khmer name already exists";
			return true;
		}
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
		// Check for duplicate category names
		const isDuplicate = await checkDuplicateCategory();
		if (isDuplicate) {
			status.value = "idle";
			return;
		}

		// Update category in database
		const { data, error } = await supabase
			.from("categories")
			.update({
				name_en: name_en.value.trim(),
				name_km: name_km.value.trim(),
			})
			.eq("id", props.category.id)
			.select("id, name_en, name_km")
			.single();

		if (error) {
			throw error;
		}

		// Success
		isOpen.value = false;
		status.value = "idle";
		originalValueEn.value = name_en.value.trim();
		originalValueKm.value = name_km.value.trim();

		// Emit update event
		emit("success", data);
	} catch (error) {
		errorMessage.value = "Failed to update category";
		status.value = "idle";
	}
};
</script>
<style></style>
