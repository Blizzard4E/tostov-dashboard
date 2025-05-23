<template>
	<div>
		<div class="flex items-center justify-between">
			<h1 class="text-3xl font-bold">Locations</h1>
			<LocationCreate @success="locationsRefresh" />
		</div>
		<div
			v-if="locationsStatus === 'pending'"
			class="flex justify-center py-8"
		>
			<div
				class="animate-spin h-8 w-8 border-4 border-blue-500 rounded-full border-t-transparent"
			></div>
		</div>
		<div
			v-else-if="!locations || locations.length === 0"
			class="py-8 text-center"
		>
			<p class="text-gray-500">
				No locations found. Create your first location!
			</p>
		</div>
		<Table v-else>
			<TableCaption>A list of locations with their tags.</TableCaption>
			<TableHeader>
				<TableRow>
					<TableHead class="w-16">ID</TableHead>
					<TableHead>Name (EN)</TableHead>
					<TableHead>Name (KM)</TableHead>
					<TableHead>Category</TableHead>
					<TableHead class="w-48">Tags</TableHead>
					<TableHead class="w-32">Options</TableHead>
				</TableRow>
			</TableHeader>
			<TableBody>
				<TableRow v-for="location in locations" :key="location.id">
					<TableCell>{{ location.id }}</TableCell>
					<TableCell>{{ location.name_en }}</TableCell>
					<TableCell>{{ location.name_km }}</TableCell>
					<TableCell>{{
						location.category?.name_en || "N/A"
					}}</TableCell>
					<TableCell>
						<div
							v-if="location.tags && location.tags.length > 0"
							class="flex flex-wrap gap-1"
						>
							<span
								v-for="tag in location.tags"
								:key="tag.id"
								class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
							>
								#{{ tag.name }}
							</span>
						</div>
						<span v-else class="text-gray-400 text-sm"
							>No tags</span
						>
					</TableCell>
					<TableCell>
						<div class="flex gap-2">
							<LocationEdit
								:location="location"
								@success="locationsRefresh"
							/>
							<LocationDelete
								:location="location"
								@success="locationsRefresh"
							/>
						</div>
					</TableCell>
				</TableRow>
			</TableBody>
		</Table>
	</div>
</template>

<script lang="ts" setup>
const supabase = useSupabaseClient<Location[]>();
const { user, clearUser } = useAuth();

// Redirect to home if user is not authenticated
if (!user.value) {
	const router = useRouter();
	router.push("/");
}

// Fetch locations with category information and tags
const {
	data: locations,
	status: locationsStatus,
	refresh: locationsRefresh,
} = useAsyncData("locations", async () => {
	const { data, error } = await supabase
		.from("locations")
		.select(
			`
            id, 
            name_en, 
            name_km, 
            category:category_id(name_en),
            location_tags(
                tags(id, name)
            )
        `
		)
		.order("created_at", { ascending: false });

	if (error) {
		console.error("Error fetching locations:", error);
		return [];
	}

	// Transform the data to flatten the tags structure
	const transformedData =
		data?.map((location) => ({
			...location,
			tags: location.location_tags?.map((lt) => lt.tags) || [],
		})) || [];

	return transformedData;
});
</script>
