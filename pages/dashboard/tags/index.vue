<template>
	<div>
		<div class="flex items-center justify-between">
			<h1 class="text-3xl font-bold">Tags</h1>
			<TagCreate @success="tagsRefresh" />
		</div>
		<Table>
			<TableCaption>A list of tags.</TableCaption>
			<TableHeader>
				<TableRow>
					<TableHead> ID </TableHead>
					<TableHead>Name</TableHead>
					<TableHead>Options</TableHead>
				</TableRow>
			</TableHeader>
			<TableBody>
				<TableRow v-for="tag in tags" :key="tag.id + tag.name">
					<TableCell>{{ tag.id }}</TableCell>
					<TableCell>{{ tag.name }}</TableCell>
					<TableCell>
						<div class="flex gap-2">
							<TagEdit :tag="tag" @success="tagsRefresh" />
							<TagDelete :tag="tag" @success="tagsRefresh" />
						</div>
					</TableCell>
				</TableRow>
			</TableBody>
		</Table>
	</div>
</template>

<script lang="ts" setup>
const supabase = useSupabaseClient<Tag[]>();
const { user, clearUser } = useAuth();

if (!user.value) {
	// Redirect to home if user is authenticated
	const router = useRouter();
	router.push("/");
}
const {
	data: tags,
	status: tagsStatus,
	refresh: tagsRefresh,
} = useAsyncData("tags", async () => {
	const { data, error } = await supabase
		.from("tags")
		.select("id, name")
		.order("created_at", { ascending: false });
	return data;
});
</script>

<style></style>
