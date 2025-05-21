<template>
	<Dialog v-model:open="isOpen">
		<DialogTrigger>
			<Button size="icon">
				<Pencil class="h-4 w-4 mr-1" />
			</Button>
		</DialogTrigger>
		<DialogContent class="lg:max-w-5xl overflow-y-scroll max-h-screen">
			<form @submit.prevent="handleLocationUpdate">
				<DialogHeader>
					<DialogTitle>Edit Location</DialogTitle>
					<DialogDescription
						>Update location details in English and
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
								v-model="locationData.name_en"
								class="col-span-3"
							/>
						</div>
						<div class="grid grid-cols-4 items-center gap-4">
							<Label for="name_km" class="text-right"
								>Name (KM)</Label
							>
							<Input
								id="name_km"
								v-model="locationData.name_km"
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
								v-model="locationData.description_en"
								class="col-span-3"
							/>
						</div>
						<div class="grid grid-cols-4 items-center gap-4">
							<Label for="description_km" class="text-right"
								>Description (KM)</Label
							>
							<Textarea
								id="description_km"
								v-model="locationData.description_km"
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
								v-model="locationData.contact"
								class="col-span-3"
							/>
						</div>
						<div class="grid grid-cols-4 items-center gap-4">
							<Label for="address" class="text-right"
								>Address</Label
							>
							<Input
								id="address"
								v-model="locationData.address"
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
								v-model="locationData.map_link"
								class="col-span-3"
							/>
						</div>
						<div class="grid grid-cols-4 items-center gap-4">
							<Label for="website" class="text-right"
								>Website</Label
							>
							<Input
								id="website"
								v-model="locationData.website"
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
								v-model="locationData.vendor_id"
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
								v-model="locationData.category_id"
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

					<!-- Tags -->
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
						<Label for="media" class="text-right">Add Images</Label>
						<InputFile
							id="media"
							class="col-span-3"
							@change="handleImagesChange"
							multiple
						/>
					</div>

					<!-- Image Management -->
					<div class="grid grid-cols-4 gap-4">
						<div class="text-right pt-2">Manage Images</div>
						<div class="col-span-3">
							<p class="text-sm text-gray-500 mb-2">
								Use up/down buttons to reorder images. Click ×
								to remove.
							</p>

							<!-- Image list with up/down buttons -->
							<div
								class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4"
							>
								<div
									v-for="(image, index) in imageList"
									:key="image.id"
									class="relative bg-gray-50 p-2 rounded-md border border-gray-200"
								>
									<div class="flex justify-between mb-2">
										<div class="flex gap-1">
											<Button
												type="button"
												variant="outline"
												size="icon"
												class="h-6 w-6"
												@click.prevent="
													moveImage(index, 'up')
												"
												:disabled="index === 0"
											>
												<ChevronUp class="h-4 w-4" />
											</Button>
											<Button
												type="button"
												variant="outline"
												size="icon"
												class="h-6 w-6"
												@click.prevent="
													moveImage(index, 'down')
												"
												:disabled="
													index ===
													imageList.length - 1
												"
											>
												<ChevronDown class="h-4 w-4" />
											</Button>
										</div>
										<Button
											type="button"
											variant="destructive"
											size="icon"
											class="h-6 w-6"
											@click.prevent="removeImage(index)"
										>
											<X class="h-4 w-4" />
										</Button>
									</div>
									<img
										:src="image.url"
										:alt="`Image ${index + 1}`"
										class="h-24 w-full object-cover rounded-md"
									/>
									<p
										class="text-xs text-center mt-1 text-gray-500"
									>
										Position: {{ index + 1 }}
									</p>
								</div>
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
						Update
					</Button>
				</DialogFooter>
			</form>
		</DialogContent>
	</Dialog>
</template>

<script lang="ts" setup>
import { Pencil, ChevronUp, ChevronDown, X } from "lucide-vue-next";

const props = defineProps({
	location: {
		type: Object,
		required: true,
	},
});

const emit = defineEmits(["success"]);
const isOpen = ref(false);
const supabase = useSupabaseClient<Location>();
const config = useRuntimeConfig();
const errorMessage = ref("");
const status = ref<FetchStatus>("idle");

// Store original data for comparison
const originalData = ref({});

// State for form data (clone the location object to avoid direct mutation)
const locationData = ref({
	id: props.location.id,
	name_en: props.location.name_en || "",
	name_km: props.location.name_km || "",
	description_en: props.location.description_en || "",
	description_km: props.location.description_km || "",
	contact: props.location.contact || "",
	address: props.location.address || "",
	map_link: props.location.map_link || "",
	website: props.location.website || "",
	vendor_id: props.location.vendor_id || null,
	category_id: props.location.category_id || null,
});

// State for images
const newImageFiles = ref<File[]>([]);
const imageList = ref<
	Array<{ id: string; url: string; isNew: boolean; file?: File }>
>([]);
const originalImageUrls = ref<string[]>([]);
const imagesChanged = ref(false);

// State for tags
const tags = ref<{ id: number; name: string }[]>([]);
const locationTags = ref<{ id: number; name: string }[]>([]);
const tagsInput = ref("");
const originalTagsInput = ref("");

// Parse hashtags from input
const parsedTags = computed(() => parseHashtags(tagsInput.value));

// State for vendors and categories
const vendors = ref<{ id: number; username: string }[]>([]);
const categories = ref<{ id: number; name_en: string }[]>([]);

// Initialize data when dialog opens
watch(isOpen, async (value) => {
	if (value) {
		// Reset all data
		newImageFiles.value = [];
		imageList.value = [];
		imagesChanged.value = false;

		// Fetch complete location data
		await fetchLocationData();

		// Fetch supporting data
		await Promise.all([fetchTags(), fetchVendors(), fetchCategories()]);

		// Store original data for comparison
		originalData.value = JSON.parse(JSON.stringify(locationData.value));
		originalTagsInput.value = tagsInput.value;
		originalImageUrls.value = imageList.value.map((img) => img.url);
	}
});

// Fetch complete location data including media and tags
const fetchLocationData = async () => {
	const { data, error } = await supabase
		.from("locations")
		.select(
			`
			*,
			location_tags(tag_id),
			tags:location_tags(tag:tag_id(id, name))
		`
		)
		.eq("id", props.location.id)
		.single();

	if (error) {
		console.error("Error fetching location:", error);
		return;
	}
	// Update location data
	locationData.value = {
		id: data.id,
		name_en: data.name_en || "",
		name_km: data.name_km || "",
		description_en: data.description_en || "",
		description_km: data.description_km || "",
		contact: data.contact || "",
		address: data.address || "",
		map_link: data.map_link || "",
		website: data.website || "",
		vendor_id: data.vendor_id || null,
		category_id: data.category_id || null,
	};

	// Initialize image list
	if (data.media && data.media.images && Array.isArray(data.media.images)) {
		imageList.value = data.media.images.map((url: string) => ({
			id: generateId(),
			url,
			isNew: false,
		}));
	} else {
		imageList.value = [];
	}

	// Initialize tags
	if (data.tags && Array.isArray(data.tags)) {
		locationTags.value = data.tags.map((tag: any) => tag.tag);
		tagsInput.value = data.tags
			.map((tag: any) => `#${tag.tag.name}`)
			.join(" ");
	} else {
		locationTags.value = [];
		tagsInput.value = "";
	}
};

// Generate a unique ID
const generateId = () => {
	return Date.now().toString(36) + Math.random().toString(36).substring(2);
};

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

/**
 * Handles processing of selected image files
 * @param fileList The FileList object containing selected files
 */
const handleImagesChange = (fileList: FileList | null) => {
	if (!fileList || fileList.length === 0) return;

	// Convert FileList to array and store for later upload
	const newFiles = Array.from(fileList);
	console.log(`Selected ${newFiles.length} new files`);

	// Add each new file to our newImageFiles array
	newFiles.forEach((file) => {
		newImageFiles.value.push(file);
	});

	// Generate previews for selected images and add to image list
	newFiles.forEach((file) => {
		const reader = new FileReader();
		reader.onload = (e) => {
			if (e.target?.result) {
				const newImage = {
					id: generateId(),
					url: e.target.result as string,
					isNew: true,
					file: file, // Store the file directly with the image object
				};
				imageList.value.push(newImage);
				console.log("Added new image to preview list:", newImage.id);
				imagesChanged.value = true;
			}
		};
		reader.readAsDataURL(file);
	});
};

// Move image up or down in the list
const moveImage = (index: number, direction: "up" | "down") => {
	if (direction === "up" && index > 0) {
		// Swap with the previous item
		const temp = imageList.value[index];
		imageList.value[index] = imageList.value[index - 1];
		imageList.value[index - 1] = temp;
		imagesChanged.value = true;
	} else if (direction === "down" && index < imageList.value.length - 1) {
		// Swap with the next item
		const temp = imageList.value[index];
		imageList.value[index] = imageList.value[index + 1];
		imageList.value[index + 1] = temp;
		imagesChanged.value = true;
	}
};

// Remove image from preview
const removeImage = (index: number) => {
	imageList.value.splice(index, 1);
	imagesChanged.value = true;
};

// Check if data has changed
const hasDataChanged = () => {
	// Check if basic fields have changed
	for (const key in locationData.value) {
		if (locationData.value[key] !== originalData.value[key]) {
			return true;
		}
	}

	// Check if tags have changed
	if (tagsInput.value !== originalTagsInput.value) {
		return true;
	}

	// Check if images have changed
	if (imagesChanged.value) {
		return true;
	}

	// If nothing has changed
	return false;
};

// Upload only new images
const uploadNewImages = async () => {
	console.log("Starting image upload process...");
	console.log("Total images in list:", imageList.value.length);

	// Get the list of new images that need to be uploaded
	const newImages = imageList.value.filter((img) => img.isNew);
	console.log("New images to upload:", newImages.length);

	if (newImages.length === 0) {
		// No new images, just return existing image URLs
		const existingUrls = imageList.value.map((img) => img.url);
		console.log("No new images, returning existing URLs:", existingUrls);
		return existingUrls;
	}

	// Upload each new image
	const uploadResults = await Promise.all(
		newImages.map(async (image) => {
			if (!image.file) {
				console.error("No file attached to image:", image.id);
				return null;
			}

			console.log("Uploading file:", image.file.name);

			const formData = new FormData();
			formData.append("file", image.file);
			formData.append("upload_preset", config.public.preset_name);
			formData.append("api_key", config.public.cloud_key);

			try {
				const response = await $fetch<{ url: string }>(
					"https://api.cloudinary.com/v1_1/" +
						config.public.cloud_name +
						"/upload",
					{
						method: "POST",
						body: formData,
					}
				);

				console.log("Upload successful, received URL:", response.url);
				return {
					id: image.id,
					url: response.url,
				};
			} catch (error) {
				console.error("Error uploading image:", error);
				return null;
			}
		})
	);

	// Build the final list of image URLs (both existing and newly uploaded)
	const finalImageUrls = [];

	// Add images in the order they appear in imageList
	for (const image of imageList.value) {
		if (image.isNew) {
			// Find the uploaded URL for this image
			const uploadResult = uploadResults.find(
				(result) => result && result.id === image.id
			);
			if (uploadResult) {
				finalImageUrls.push(uploadResult.url);
				console.log(
					"Added new uploaded URL to final list:",
					uploadResult.url
				);
			} else {
				console.warn(
					"Failed to find upload result for image:",
					image.id
				);
			}
		} else {
			// Add existing image URL
			finalImageUrls.push(image.url);
			console.log("Added existing URL to final list:", image.url);
		}
	}

	console.log("Final image URLs:", finalImageUrls);
	return finalImageUrls;
};

// Process tags and handle creation/association
const processTags = async (locationId: number) => {
	console.log("Starting tag processing...");
	const tagsList = parsedTags.value;

	// First, delete all existing tag associations for this location
	console.log("Deleting existing tag associations for location:", locationId);
	const { error: deleteError } = await supabase
		.from("location_tags")
		.delete()
		.eq("location_id", locationId);

	if (deleteError) {
		console.error("Error deleting existing location tags:", deleteError);
		return;
	}

	console.log("Tag list to process:", tagsList);
	// If no tags, we're done after deleting associations
	if (!tagsList.length) {
		console.log("No tags to process, finishing");
		return;
	}

	// Create a map for quick lookup of existing tag IDs
	const tagMap = new Map(
		tags.value.map((tag) => [tag.name.toLowerCase(), tag.id])
	);
	console.log("Tag map:", [...tagMap.entries()]);

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

	console.log("Existing tag IDs:", existingTagIds);
	console.log("New tags to create:", newTags);

	// Create new tags if needed
	if (newTags.length > 0) {
		console.log("Creating new tags...");
		const { data: createdTags, error: createError } = await supabase
			.from("tags")
			.insert(newTags.map((tag) => ({ name: tag })))
			.select("id");

		if (createError) {
			console.error("Error creating new tags:", createError);
		} else if (createdTags) {
			console.log("Created tags:", createdTags);
			// Add newly created tag IDs to our list
			existingTagIds.push(...createdTags.map((tag) => tag.id));
		}
	}

	console.log("Final tag IDs to associate:", existingTagIds);

	// Associate all tags with the location
	if (existingTagIds.length > 0) {
		console.log("Associating tags with location...");
		const tagInserts = existingTagIds.map((tagId) => ({
			location_id: locationId,
			tag_id: tagId,
		}));

		const { data: insertedTags, error: tagError } = await supabase
			.from("location_tags")
			.insert(tagInserts)
			.select();

		if (tagError) {
			console.error("Error associating tags:", tagError);
		} else {
			console.log("Successfully associated tags:", insertedTags);
		}
	}

	console.log("Tag processing complete!");
};

// Build update object with only changed fields
const buildUpdateObject = () => {
	const updates: Record<string, any> = {};
	const original: Record<string, any> = originalData.value;

	// Compare each field and only include changed ones
	for (const key in locationData.value) {
		if (locationData.value[key] !== original[key]) {
			updates[key] = locationData.value[key];
		}
	}

	// Handle images separately
	if (imagesChanged.value) {
		// We'll add the media field later with image URLs
	}

	return updates;
};

// Validate form
const validateForm = () => {
	// Only validate required fields if they've changed
	if (
		locationData.value.name_en !== originalData.value.name_en &&
		!locationData.value.name_en.trim()
	) {
		errorMessage.value = "English name is required";
		return false;
	}

	if (
		locationData.value.name_km !== originalData.value.name_km &&
		!locationData.value.name_km.trim()
	) {
		errorMessage.value = "Khmer name is required";
		return false;
	}

	if (
		locationData.value.vendor_id !== originalData.value.vendor_id &&
		!locationData.value.vendor_id
	) {
		errorMessage.value = "Vendor is required";
		return false;
	}

	if (
		locationData.value.category_id !== originalData.value.category_id &&
		!locationData.value.category_id
	) {
		errorMessage.value = "Category is required";
		return false;
	}

	// Only validate images if they've been changed and are now empty
	if (imagesChanged.value && imageList.value.length === 0) {
		errorMessage.value = "At least one image is required";
		return false;
	}

	return true;
};

// Handle location update
const handleLocationUpdate = async () => {
	// Reset error message
	errorMessage.value = "";

	// Validate form
	if (!validateForm()) {
		return;
	}

	// Set status to pending
	status.value = "pending";

	try {
		// Handle image updates if needed
		let imageUrls = [];
		if (imagesChanged.value) {
			// Upload new images and get final image URLs list
			imageUrls = await uploadNewImages();
		} else {
			// Use original image URLs
			imageUrls = originalImageUrls.value;
		}

		// Update location with all fields
		const { data, error } = await supabase
			.from("locations")
			.update({
				name_en: locationData.value.name_en.trim(),
				name_km: locationData.value.name_km.trim(),
				description_en: locationData.value.description_en.trim(),
				description_km: locationData.value.description_km.trim(),
				contact: locationData.value.contact.trim(),
				address: locationData.value.address.trim(),
				map_link: locationData.value.map_link.trim(),
				website: locationData.value.website.trim(),
				vendor_id: locationData.value.vendor_id,
				category_id: locationData.value.category_id,
				media: { images: imageUrls },
			})
			.eq("id", locationData.value.id)
			.select("id")
			.single();

		if (error) {
			errorMessage.value = "Unable to update location";
			console.error("Error updating location:", error);
			return;
		}

		// Always process tags
		console.log("Processing tags for location ID:", data.id);
		console.log("Tags input:", tagsInput.value);
		console.log("Parsed tags:", parsedTags.value);
		await processTags(data.id);

		// Success
		status.value = "idle";
		isOpen.value = false;

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
