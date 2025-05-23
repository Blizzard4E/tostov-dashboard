<template>
	<div>
		<NuxtLayout>
			<NuxtPage />
		</NuxtLayout>
	</div>
</template>

<script lang="ts" setup>
const { user } = useAuth();
const router = useRouter();
if (user.value) {
	// Redirect to home if user is authenticated

	router.push("/dashboard");
} else {
	router.push("/login");
}
</script>

<style></style>
