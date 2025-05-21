<template>
	<Dialog v-model:open="isOpen">
		<DialogTrigger><Button>Create Location</Button></DialogTrigger>
		<DialogContent class="max-w-3xl">
			<form @submit.prevent="handleLocationCreate">
				<DialogHeader>
					<DialogTitle>Create Location</DialogTitle>
					<DialogDescription
						>Add a new location with details in English and
						Khmer</DialogDescription
					>
				</DialogHeader>
				<div class="grid gap-4 py-4">
					<!-- Basic Info -->
					<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
						<div class="grid grid-cols-4 items-center gap-4">
							<Label for="name_en" class="text-right"
								>Name (EN)</Label
							>
							<Input
								id="name_en"
								v-model="location.name_en"
								class="col-span-3"
							/>
						</div>
						<div class="grid grid-cols-4 items-center gap-4">
							<Label for="name_km" class="text-right"
								>Name (KM)</Label
							>
							<Input
								id="name_km"
								v-model="location.name_km"
								class="col-span-3"
							/>
						</div>
					</div>

					<!-- Descriptions -->
					<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
						<div class="grid grid-cols-4 items-center gap-4">
							<Label for="description_en" class="text-right"
								>Description (EN)</Label
							>
							<Textarea
								id="description_en"
								v-model="location.description_en"
								class="col-span-3"
							/>
						</div>
						<div class="grid grid-cols-4 items-center gap-4">
							<Label for="description_km" class="text-right"
								>Description (KM)</Label
							>
							<Textarea
								id="description_km"
								v-model="location.description_km"
								class="col-span-3"
							/>
						</div>
					</div>

					<!-- Contact & Address -->
					<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
						<div class="grid grid-cols-4 items-center gap-4">
							<Label for="contact" class="text-right"
								>Contact</Label
							>
							<Input
								id="contact"
								v-model="location.contact"
								class="col-span-3"
							/>
						</div>
						<div class="grid grid-cols-4 items-center gap-4">
							<Label for="address" class="text-right"
								>Address</Label
							>
							<Input
								id="address"
								v-model="location.address"
								class="col-span-3"
							/>
						</div>
					</div>

					<!-- Map & Website -->
					<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
						<div class="grid grid-cols-4 items-center gap-4">
							<Label for="map_link" class="text-right"
								>Map Link</Label
							>
							<Input
								id="map_link"
								v-model="location.map_link"
								class="col-span-3"
							/>
						</div>
						<div class="grid grid-cols-4 items-center gap-4">
							<Label for="website" class="text-right"
								>Website</Label
							>
							<Input
								id="website"
								v-model="location.website"
								class="col-span-3"
							/>
						</div>
					</div>

					<!-- Vendor & Category -->
					<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
						<div class="grid grid-cols-4 items-center gap-4">
							<Label for="vendor_id" class="text-right"
								>Vendor</Label
							>
							<Select
								v-model="location.vendor_id"
								class="col-span-3"
							>
								<SelectTrigger>
									<SelectValue placeholder="Select vendor" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem
										v-for="vendor in vendors"
										:key="vendor.id"
										:value="vendor.id"
									>
										{{ vendor.username }}
									</SelectItem>
								</SelectContent>
							</Select>
						</div>
						<div class="grid grid-cols-4 items-center gap-4">
							<Label for="category_id" class="text-right"
								>Category</Label
							>
							<Select
								v-model="location.category_id"
								class="col-span-3"
							>
								<SelectTrigger>
									<SelectValue
										placeholder="Select category"
									/>
								</SelectTrigger>
								<SelectContent>
									<SelectItem
										v-for="category in categories"
										:key="category.id"
										:value="category.id"
									>
										{{ category.name_en }}
									</SelectItem>
								</SelectContent>
							</Select>
						</div>
					</div>

					<!-- Tags - Modified to use text input -->
					<div class="grid grid-cols-4 items-center gap-4">
						<Label for="tags" class="text-right">Tags</Label>
						<div class="col-span-3">
							<Input
								id="tags"
								v-model="tagsInput"
								placeholder="Enter tags like #food #drink #cafe (separated by space or any symbol)"
								class="w-full"
							/>
							<p class="text-xs text-gray-500 mt-1">
								Enter hashtags starting with # (e.g., #food
								#cafe). Multiple tags can be separated by spaces
								or symbols.
							</p>
							<div
								v-if="parsedTags.length > 0"
								class="flex flex-wrap gap-2 mt-2"
							>
								<div
									v-for="tag in parsedTags"
									:key="tag"
									class="bg-blue-100 text-blue-800 px-2 py-1 rounded-md text-sm"
								>
									#{{ tag }}
								</div>
							</div>
						</div>
					</div>

					<!-- Images -->
					<div class="grid grid-cols-4 items-center gap-4">
						<Label for="media" class="text-right">Images</Label>
						<InputFile
							id="media"
							class="col-span-3"
							@change="handleImagesChange"
							multiple
						/>
					</div>

					<!-- Preview Images -->
					<div
						v-if="previewImages.length > 0"
						class="grid grid-cols-4 gap-4"
					>
						<div class="text-right pt-2">Previews</div>
						<div class="col-span-3 flex flex-wrap gap-2">
							<div
								v-for="(preview, index) in previewImages"
								:key="index"
								class="relative"
							>
								<img
									:src="preview"
									alt="Preview"
									class="h-20 w-20 object-cover rounded-md"
								/>
								<button
									type="button"
									@click="removeImage(index)"
									class="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center"
								>
									×
								</button>
							</div>
						</div>
					</div>
				</div>
				<DialogFooter>
					<p class="text-red-500">{{ errorMessage }}</p>
					<Button
						type="submit"
						:disabled="status === 'pending'"
						:status="status"
					>
						Create
					</Button>
				</DialogFooter>
			</form>
		</DialogContent>
	</Dialog>
</template>

<script lang="ts" setup>
const isOpen = ref(false);
const supabase = useSupabaseClient<Location>();
const config = useRuntimeConfig();
const emit = defineEmits(["success"]);

// State for form data
const location = ref({
	name_en: "",
	name_km: "",
	description_en: "",
	description_km: "",
	contact: "",
	address: "",
	map_link: "",
	website: "",
	vendor_id: null as number | null,
	category_id: null as number | null,
});

const errorMessage = ref("");
const status = ref<FetchStatus>("idle");

// State for images
const imageFiles = ref<FileList | null>(null);
const previewImages = ref<string[]>([]);

// State for tags - modified
const tags = ref<{ id: number; name: string }[]>([]);
const tagsInput = ref("");
const parsedTags = computed(() => parseHashtags(tagsInput.value));

// State for vendors and categories
const vendors = ref<{ id: number; username: string }[]>([]);
const categories = ref<{ id: number; name_en: string }[]>([]);

// Fetch data on component mount
onMounted(async () => {
	await Promise.all([fetchTags(), fetchVendors(), fetchCategories()]);
});

// Parse hashtags from input
const parseHashtags = (input: string): string[] => {
	if (!input) return [];

	// Replace any separator with space
	const normalized = input.replace(/[,|;.]/g, " ");

	// Match hashtags starting with # followed by letters, numbers, and spaces
	// Then filter out empty strings and remove the # symbol
	return normalized
		.split(" ")
		.filter((word) => word.startsWith("#") && word.length > 1)
		.map((tag) => tag.substring(1).trim())
		.filter((tag) => tag.length > 0);
};

// Fetch tags
const fetchTags = async () => {
	const { data, error } = await supabase
		.from("tags")
		.select("id, name")
		.order("name");

	if (error) {
		console.error("Error fetching tags:", error);
		return;
	}

	tags.value = data || [];
};

// Fetch vendors
const fetchVendors = async () => {
	const { data, error } = await supabase
		.from("vendors")
		.select("id, username")
		.order("username");

	if (error) {
		console.error("Error fetching vendors:", error);
		return;
	}

	vendors.value = data || [];
};

// Fetch categories
const fetchCategories = async () => {
	const { data, error } = await supabase
		.from("categories")
		.select("id, name_en")
		.order("name_en");

	if (error) {
		console.error("Error fetching categories:", error);
		return;
	}

	categories.value = data || [];
};

// Handle image selection
const handleImagesChange = (files: FileList) => {
	imageFiles.value = files;

	// Clear previous previews
	previewImages.value = [];

	// Generate previews for selected images
	for (let i = 0; i < files.length; i++) {
		const file = files[i];
		const reader = new FileReader();
		reader.onload = (e) => {
			if (e.target?.result) {
				previewImages.value.push(e.target.result as string);
			}
		};
		reader.readAsDataURL(file);
	}
};

// Remove image from preview
const removeImage = (index: number) => {
	if (!imageFiles.value) return;

	// Create a new FileList without the removed file
	const dt = new DataTransfer();
	for (let i = 0; i < imageFiles.value.length; i++) {
		if (i !== index) {
			dt.items.add(imageFiles.value[i]);
		}
	}

	imageFiles.value = dt.files;
	previewImages.value.splice(index, 1);
};

// Upload multiple images in parallel
const uploadImages = async (files: FileList) => {
	const uploadPromises = Array.from(files).map((file) => {
		const formData = new FormData();
		formData.append("file", file);
		formData.append("upload_preset", config.public.preset_name);
		formData.append("api_key", config.public.cloud_key);

		return $fetch<{ url: string }>(
			"https://api.cloudinary.com/v1_1/" +
				config.public.cloud_name +
				"/upload",
			{
				method: "POST",
				body: formData,
			}
		);
	});

	try {
		const responses = await Promise.all(uploadPromises);
		return responses.map((response) => response.url);
	} catch (error) {
		console.error("Error uploading images:", error);
		throw new Error("Failed to upload one or more images");
	}
};

// Process tags and handle creation/association
const processTags = async (locationId: number) => {
	const tagsList = parsedTags.value;
	if (!tagsList.length) return;

	// Create a map for quick lookup of existing tag IDs
	const tagMap = new Map(
		tags.value.map((tag) => [tag.name.toLowerCase(), tag.id])
	);
	const existingTagIds: number[] = [];
	const newTags: string[] = [];

	// Separate existing tags from new ones
	tagsList.forEach((tag) => {
		const normalizedTag = tag.toLowerCase();
		if (tagMap.has(normalizedTag)) {
			existingTagIds.push(tagMap.get(normalizedTag)!);
		} else {
			newTags.push(tag);
		}
	});

	// Create new tags if needed
	if (newTags.length > 0) {
		const { data: createdTags, error: createError } = await supabase
			.from("tags")
			.insert(newTags.map((tag) => ({ name: tag })))
			.select("id");

		if (createError) {
			console.error("Error creating new tags:", createError);
		} else if (createdTags) {
			// Add newly created tag IDs to our list
			existingTagIds.push(...createdTags.map((tag) => tag.id));
		}
	}

	// Associate all tags with the location
	if (existingTagIds.length > 0) {
		const tagInserts = existingTagIds.map((tagId) => ({
			location_id: locationId,
			tag_id: tagId,
		}));

		const { error: tagError } = await supabase
			.from("location_tags")
			.insert(tagInserts);

		if (tagError) {
			console.error("Error associating tags:", tagError);
		}
	}
};

// Validate form
const validateForm = () => {
	// Check required fields
	if (!location.value.name_en.trim()) {
		errorMessage.value = "English name is required";
		return false;
	}

	if (!location.value.name_km.trim()) {
		errorMessage.value = "Khmer name is required";
		return false;
	}

	if (!location.value.vendor_id) {
		errorMessage.value = "Vendor is required";
		return false;
	}

	if (!location.value.category_id) {
		errorMessage.value = "Category is required";
		return false;
	}

	if (!imageFiles.value || imageFiles.value.length === 0) {
		errorMessage.value = "At least one image is required";
		return false;
	}

	return true;
};

// Handle location creation
const handleLocationCreate = async () => {
	// Reset error message
	errorMessage.value = "";

	// Validate form
	if (!validateForm()) {
		return;
	}

	// Set status to pending
	status.value = "pending";

	try {
		// Upload images
		const imageUrls = await uploadImages(imageFiles.value as FileList);
		console.log("Uploaded image URLs:", imageUrls);

		// Create location
		const { data, error } = await supabase
			.from("locations")
			.insert({
				name_en: location.value.name_en.trim(),
				name_km: location.value.name_km.trim(),
				description_en: location.value.description_en.trim(),
				description_km: location.value.description_km.trim(),
				contact: location.value.contact.trim(),
				address: location.value.address.trim(),
				map_link: location.value.map_link.trim(),
				website: location.value.website.trim(),
				vendor_id: location.value.vendor_id,
				category_id: location.value.category_id,
				media: { images: imageUrls }, // Store as JSONB
			})
			.select("id")
			.single();

		if (error) {
			errorMessage.value = "Unable to create location";
			console.error("Error creating location:", error);
			return;
		}

		// Process and associate tags
		await processTags(data.id);

		// Success
		status.value = "idle";
		isOpen.value = false;

		// Reset form
		location.value = {
			name_en: "",
			name_km: "",
			description_en: "",
			description_km: "",
			contact: "",
			address: "",
			map_link: "",
			website: "",
			vendor_id: null,
			category_id: null,
		};
		tagsInput.value = "";
		imageFiles.value = null;
		previewImages.value = [];

		// Emit success event
		emit("success", data);
	} catch (err) {
		errorMessage.value = "An error occurred";
		console.error("Exception:", err);
	} finally {
		status.value = "idle";
	}
};
</script>

<style scoped>
/* Add any component-specific styles here */
</style>
