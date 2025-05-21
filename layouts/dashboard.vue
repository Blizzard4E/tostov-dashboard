<template>
	<div>
		<SidebarProvider>
			<AppSidebar />
			<main class="p-4">
				<SidebarTrigger />
				<slot />
			</main>
		</SidebarProvider>
	</div>
</template>

<script lang="ts" setup></script>

<style></style>
