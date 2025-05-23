<template>
	<div>
		<NuxtLayout name="dashboard">
			<NuxtPage />
		</NuxtLayout>
	</div>
</template>

<script lang="ts" setup>
const { user } = useAuth();
const router = useRouter();
if (!user.value) {
	router.push("/login");
}
</script>

<style></style>
