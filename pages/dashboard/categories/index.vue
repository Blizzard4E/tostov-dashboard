<template>
	<div>
		<div class="flex items-center justify-between">
			<h1 class="text-3xl font-bold">Categories</h1>
			<CategoryCreate @success="categoriesRefresh" />
		</div>
		<Table>
			<TableCaption>A list of categories.</TableCaption>
			<TableHeader>
				<TableRow>
					<TableHead>ID</TableHead>
					<TableHead>English Name</TableHead>
					<TableHead>Khmer Name</TableHead>
					<TableHead>Options</TableHead>
				</TableRow>
			</TableHeader>
			<TableBody>
				<TableRow
					v-for="category in categories"
					:key="category.id + category.name_en"
				>
					<TableCell>{{ category.id }}</TableCell>
					<TableCell>{{ category.name_en }}</TableCell>
					<TableCell>{{ category.name_km }}</TableCell>
					<TableCell>
						<div class="flex gap-2">
							<CategoryEdit
								:category="category"
								@success="categoriesRefresh"
							/>
							<CategoryDelete
								:category="category"
								@success="categoriesRefresh"
							/>
						</div>
					</TableCell>
				</TableRow>
			</TableBody>
		</Table>
	</div>
</template>
<script lang="ts" setup>
const supabase = useSupabaseClient<Category[]>();
const { user, clearUser } = useAuth();

if (!user.value) {
	// Redirect to home if user is not authenticated
	const router = useRouter();
	router.push("/");
}

const {
	data: categories,
	status: categoriesStatus,
	refresh: categoriesRefresh,
} = useAsyncData("categories", async () => {
	const { data, error } = await supabase
		.from("categories")
		.select("id, name_en, name_km")
		.order("created_at", { ascending: false });

	if (error) {
		console.error("Error fetching categories:", error);
		return [];
	}

	return data;
});
</script>
<style></style>
