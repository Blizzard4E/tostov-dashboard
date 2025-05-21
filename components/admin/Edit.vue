<template>
	<Dialog v-model:open="isOpen">
		<DialogTrigger>
			<Button size="icon"><component :is="Edit" /></Button>
		</DialogTrigger>
		<DialogContent>
			<form @submit.prevent="handleEdit">
				<DialogHeader>
					<DialogTitle>Edit Admin</DialogTitle>
					<DialogDescription
						>Update admin information</DialogDescription
					>
				</DialogHeader>
				<div class="grid gap-4 py-4">
					<div class="grid grid-cols-4 items-center gap-4">
						<Label for="username" class="text-right"
							>Username</Label
						>
						<Input
							id="username"
							v-model="username"
							class="col-span-3"
							placeholder="Leave unchanged"
						/>
					</div>
					<div class="grid grid-cols-4 items-center gap-4">
						<Label for="email" class="text-right">Email</Label>
						<Input
							id="email"
							class="col-span-3"
							v-model="email"
							placeholder="Leave unchanged"
						/>
					</div>
					<div class="grid grid-cols-4 items-center gap-4">
						<Label for="profile_pic" class="text-right"
							>Picture</Label
						>
						<InputFile
							id="profile_pic"
							class="col-span-3"
							@change="changeProfilePic"
						/>
					</div>
					<div class="grid grid-cols-4 items-center gap-4">
						<Label for="password" class="text-right">
							New Password
						</Label>
						<Input
							id="password"
							type="password"
							class="col-span-3"
							v-model="password"
							placeholder="Leave blank to keep current password"
						/>
					</div>
				</div>
				<DialogFooter>
					<p class="text-red-500">{{ errorMessage }}</p>
					<Button
						type="submit"
						:disabled="status === 'pending'"
						:status="status"
						>Update</Button
					>
				</DialogFooter>
			</form>
		</DialogContent>
	</Dialog>
</template>
<script lang="ts" setup>
import { Edit } from "lucide-vue-next";
import bcrypt from "bcryptjs";

const props = defineProps<{
	admin: {
		id: string;
		username: string;
		email: string;
		profile_pic?: string;
	};
}>();

const isOpen = ref(false);
const supabase = useSupabaseClient<Admin>();
const config = useRuntimeConfig();
const username = ref(props.admin.username);
const email = ref(props.admin.email);
const password = ref("");
const errorMessage = ref("");
const profilePic = ref<FileList | null>(null);
const status = ref<FetchStatus>("idle");
const originalValues = ref({
	username: props.admin.username,
	email: props.admin.email,
});
const emit = defineEmits(["success"]);
// Reset form when admin changes
watch(
	() => props.admin,
	(newAdmin) => {
		username.value = newAdmin.username;
		email.value = newAdmin.email;
		password.value = "";
		errorMessage.value = "";
		profilePic.value = null;
		originalValues.value = {
			username: newAdmin.username,
			email: newAdmin.email,
		};
	},
	{ deep: true }
);

const changeProfilePic = (files: FileList) => {
	profilePic.value = files;
};

const uploadProfile = async (files: FileList) => {
	let formData = new FormData();
	formData.append("file", files[0]);
	formData.append("upload_preset", config.public.preset_name);
	formData.append("api_key", config.public.cloud_key);
	const response = await $fetch<{ url: string }>(
		"https://api.cloudinary.com/v1_1/" +
			config.public.cloud_name +
			"/upload",
		{
			method: "POST",
			body: formData,
		}
	);
	return response.url;
};

const validateForm = () => {
	// All fields are optional for updates, so we only validate
	// that email and username are valid IF they've been changed

	if (
		username.value !== originalValues.value.username &&
		!username.value.trim()
	) {
		errorMessage.value = "Username cannot be empty";
		return false;
	}

	if (email.value !== originalValues.value.email && !email.value.trim()) {
		errorMessage.value = "Email cannot be empty";
		return false;
	}

	// No need to validate password - it's optional
	return true;
};

const handleEdit = async () => {
	if (!validateForm()) {
		return;
	}

	status.value = "pending";
	errorMessage.value = "";

	try {
		// Create update payload - only include changed fields
		const updates: any = {};

		// Only add username if it has changed
		if (username.value.trim() !== originalValues.value.username) {
			updates.username = username.value.trim();
		}

		// Only add email if it has changed
		if (email.value.trim() !== originalValues.value.email) {
			updates.email = email.value.trim();
		}

		// Handle profile picture upload if provided
		if (profilePic.value && profilePic.value.length > 0) {
			const profilePicLink = await uploadProfile(profilePic.value);
			updates.profile_pic = profilePicLink;
		}

		// Handle password change if provided
		if (password.value.trim()) {
			const salt = bcrypt.genSaltSync(10);
			const hash = bcrypt.hashSync(password.value, salt);
			updates.password = hash;
		}

		// Only proceed with update if there are changes
		if (Object.keys(updates).length === 0) {
			status.value = "idle";
			isOpen.value = false;
			return;
		}

		// Update admin in database
		const { data, error } = await supabase
			.from("admins")
			.update(updates)
			.eq("id", props.admin.id)
			.select("id, username, email")
			.single();

		if (error) {
			throw error;
		}

		// Success
		isOpen.value = false;
		status.value = "idle";

		// Emit update event
		emit("success");
	} catch (error: any) {
		errorMessage.value = error.message || "Failed to update admin";
		status.value = "idle";
	}
};
</script>
<style></style>
