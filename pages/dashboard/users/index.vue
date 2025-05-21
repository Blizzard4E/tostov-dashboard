<template>
	<div>
		<div class="flex items-center justify-between">
			<h1 class="text-3xl font-bold">Users</h1>
			<UserCreate @success="usersRefresh" />
		</div>
		<Table>
			<TableCaption>A list of users.</TableCaption>
			<TableHeader>
				<TableRow>
					<TableHead> ID </TableHead>
					<TableHead>Username</TableHead>
					<TableHead>Email</TableHead>
					<TableHead>Options</TableHead>
				</TableRow>
			</TableHeader>
			<TableBody>
				<TableRow v-for="user in users" :key="user.id + user.username">
					<TableCell>{{ user.id }}</TableCell>
					<TableCell>{{ user.username }}</TableCell>
					<TableCell>{{ user.email }}</TableCell>
					<TableCell>
						<div class="flex gap-2">
							<UserEdit :user="user" @success="usersRefresh" />
							<UserDelete :user="user" @success="usersRefresh" />
						</div>
					</TableCell>
				</TableRow>
			</TableBody>
		</Table>
	</div>
</template>

<script lang="ts" setup>
const supabase = useSupabaseClient<User[]>();
const { user, clearUser } = useAuth();

if (!user.value) {
	// Redirect to home if user is authenticated
	const router = useRouter();
	router.push("/");
}
const {
	data: users,
	status: usersStatus,
	refresh: usersRefresh,
} = useAsyncData("users", async () => {
	const { data, error } = await supabase
		.from("users")
		.select("id, username, email")
		.order("created_at", { ascending: false });
	return data;
});
</script>

<style></style>
