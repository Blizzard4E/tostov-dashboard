<template>
	<div>
		<NuxtLayout>
			<NuxtPage />
		</NuxtLayout>
	</div>
</template>

<script lang="ts" setup>
const { user } = useAuth();
if (user.value) {
	// Redirect to home if user is authenticated
	const router = useRouter();
	router.push("/dashboard");
}
</script>

<style></style>
