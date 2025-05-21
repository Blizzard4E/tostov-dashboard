<template>
	<div class="w-[1200px] mx-auto grid place-items-center h-screen">
		<form @submit.prevent="login" class="grid gap-4 w-[400px]">
			<h1 class="text-3xl text-center font-bold">Login</h1>
			<div class="flex flex-col gap-2">
				<Label for="email">Email</Label>
				<Input
					id="email"
					v-model="email"
					type="email"
					placeholder="Email"
				/>
			</div>
			<div class="flex flex-col gap-2">
				<Label for="password">Password</Label>
				<Input
					id="password"
					v-model="password"
					type="password"
					placeholder="Password"
				/>
			</div>
			<p v-if="errorMessage" class="text-red-500 text-sm">
				{{ errorMessage }}
			</p>
			<Button type="submit" :disabled="isLoading">
				{{ isLoading ? "Logging in..." : "Login" }}
			</Button>
		</form>
	</div>
</template>

<script lang="ts" setup>
import bcryptjs from "bcryptjs";

const { setUser } = useAuth();
const supabase = useSupabaseClient<Admin>();
const email = ref("tostov@super.com");
const password = ref("j3EZknF1U1x7YK");
const errorMessage = ref("");
const isLoading = ref(false);

const login = async () => {
	try {
		isLoading.value = true;
		errorMessage.value = "";

		// Only query by email to get the hashed password
		const { data, error } = await supabase
			.from("admins")
			.select("id, username, email, profile_pic, password") // Include the hashed password
			.eq("email", email.value)
			.single();

		if (error || !data) {
			errorMessage.value = "Invalid email or password";
			return;
		}
		console.log(password.value);
		console.log(data.password);
		// Verify password using bcrypt
		const passwordMatch = await bcryptjs.compare(
			password.value,
			data.password
		);

		if (!passwordMatch) {
			errorMessage.value = "Invalid email or password";
			return;
		}

		// Password verified successfully
		setUser({
			id: data.id,
			name: data.username,
			email: data.email,
			profile_pic: data.profile_pic,
		});

		navigateTo("/dashboard");
	} catch (err) {
		console.error(err);
		errorMessage.value = "An error occurred during login";
	} finally {
		isLoading.value = false;
	}
};
</script>

<style></style>
