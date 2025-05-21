<template>
	<Dialog v-model:open="isOpen">
		<DialogTrigger><Button>Create</Button></DialogTrigger>
		<DialogContent>
			<form @submit.prevent="handleSignUp">
				<DialogHeader>
					<DialogTitle>Create Admin</DialogTitle>
					<DialogDescription> Create Admin </DialogDescription>
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
						/>
					</div>
					<div class="grid grid-cols-4 items-center gap-4">
						<Label for="email" class="text-right"> Email </Label>
						<Input id="email" class="col-span-3" v-model="email" />
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
							Password
						</Label>
						<Input
							id="password"
							class="col-span-3"
							v-model="password"
						/>
					</div>
				</div>
				<DialogFooter>
					<p class="text-red-500">{{ errorMessage }}</p>
					<Button
						type="submit"
						:disabled="status == 'pending'"
						:status="status"
						>Create</Button
					>
				</DialogFooter>
			</form>
		</DialogContent>
	</Dialog>
</template>

<script lang="ts" setup>
import bcrypt from "bcryptjs";
const isOpen = ref();
const supabase = useSupabaseClient<Admin>();
const config = useRuntimeConfig();
const username = ref("");
const email = ref("");
const password = ref("");
const errorMessage = ref("");
const profilePic = ref<FileList>();
const status = ref<FetchStatus>("idle");
const emit = defineEmits(["success"]);
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
	if (!username.value) {
		errorMessage.value = "Username is required";
		return false;
	}
	if (!email.value) {
		errorMessage.value = "Email is required";
		return false;
	}
	if (!password.value) {
		errorMessage.value = "Password is required";
		return false;
	}
	if (!profilePic.value) {
		errorMessage.value = "Profile picture is required";
		return false;
	}
	return true;
};
const salt = bcrypt.genSaltSync(10);

const handleSignUp = async () => {
	if (!validateForm()) {
		return;
	}
	status.value = "pending";
	const hash = bcrypt.hashSync(password.value, salt);
	if (!bcrypt.compareSync(password.value, hash)) return;
	const profilePicLink = await uploadProfile(profilePic.value as FileList);
	const { data, error } = await supabase
		.from("admins")
		.insert({
			username: username.value,
			email: email.value,
			password: hash,
			profile_pic: profilePicLink,
		})
		.select("id, username, email")
		.single();
	if (data) {
		status.value = "idle";
		isOpen.value = false;
		emit("success");
	}
	if (error) {
		errorMessage.value = "Unable to create admin";
	}
};
</script>

<style></style>
