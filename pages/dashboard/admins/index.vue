<template>
	<div>
		<div class="flex items-center justify-between">
			<h1 class="text-3xl font-bold">Admins</h1>
			<AdminCreate @success="adminsRefresh" />
		</div>
		<Table>
			<TableCaption>A list of admins.</TableCaption>
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
					v-for="admin in admins"
					:key="admin.id + admin.username"
				>
					<TableCell>{{ admin.id }}</TableCell>
					<TableCell>{{ admin.username }}</TableCell>
					<TableCell>{{ admin.email }}</TableCell>
					<TableCell>
						<div class="flex gap-2">
							<AdminEdit
								:admin="admin"
								@success="adminsRefresh"
							/>
							<AdminDelete
								:admin="admin"
								@success="adminsRefresh"
							/>
						</div>
					</TableCell>
				</TableRow>
			</TableBody>
		</Table>
	</div>
</template>

<script lang="ts" setup>
const supabase = useSupabaseClient<Admin[]>();
const { user, clearUser } = useAuth();

if (!user.value) {
	// Redirect to home if user is authenticated
	const router = useRouter();
	router.push("/");
}
const {
	data: admins,
	status: adminsStatus,
	refresh: adminsRefresh,
} = useAsyncData("admins", async () => {
	const { data, error } = await supabase
		.from("admins")
		.select("id, username, email")
		.order("created_at", { ascending: false });
	return data;
});
</script>

<style></style>
