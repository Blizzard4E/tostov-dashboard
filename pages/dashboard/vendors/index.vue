<template>
	<div>
		<div class="flex items-center justify-between">
			<h1 class="text-3xl font-bold">Vendors</h1>
			<VendorCreate @success="vendorsRefresh" />
		</div>
		<Table>
			<TableCaption>A list of vendors.</TableCaption>
			<TableHeader>
				<TableRow>
					<TableHead> ID </TableHead>
					<TableHead>Username</TableHead>
					<TableHead>Email</TableHead>
					<TableHead>Options</TableHead>
				</TableRow>
			</TableHeader>
			<TableBody>
				<TableRow
					v-for="vendor in vendors"
					:key="vendor.id + vendor.username"
				>
					<TableCell>{{ vendor.id }}</TableCell>
					<TableCell>{{ vendor.username }}</TableCell>
					<TableCell>{{ vendor.email }}</TableCell>
					<TableCell>
						<div class="flex gap-2">
							<VendorEdit
								:vendor="vendor"
								@success="vendorsRefresh"
							/>
							<VendorDelete
								:vendor="vendor"
								@success="vendorsRefresh"
							/>
						</div>
					</TableCell>
				</TableRow>
			</TableBody>
		</Table>
	</div>
</template>

<script lang="ts" setup>
const supabase = useSupabaseClient<Vendor[]>();
const { user, clearUser } = useAuth();

if (!user.value) {
	// Redirect to home if user is authenticated
	const router = useRouter();
	router.push("/");
}
const {
	data: vendors,
	status: vendorsStatus,
	refresh: vendorsRefresh,
} = useAsyncData("vendors", async () => {
	const { data, error } = await supabase
		.from("vendors")
		.select("id, username, email")
		.order("created_at", { ascending: false });
	return data;
});
</script>

<style></style>
