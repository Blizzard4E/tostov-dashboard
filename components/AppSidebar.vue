<script setup lang="ts">
import {
	Calendar,
	Home,
	Inbox,
	Search,
	Settings,
	User,
	Tag,
	Puzzle,
	MapPin,
} from "lucide-vue-next";
import {
	Sidebar,
	SidebarContent,
	SidebarGroup,
	SidebarGroupContent,
	SidebarGroupLabel,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
} from "@/components/ui/sidebar";

// Menu items.
const items = [
	{
		title: "Vendors",
		url: "/dashboard/vendors",
		icon: User,
	},
	{
		title: "Tags",
		url: "/dashboard/tags",
		icon: Tag,
	},
	{
		title: "Categories",
		url: "/dashboard/categories",
		icon: Puzzle,
	},
	{
		title: "Locations",
		url: "/dashboard/locations",
		icon: MapPin,
	},
	{
		title: "Admins",
		url: "/dashboard/admins",
		icon: User,
	},
	{
		title: "Users",
		url: "/dashboard/users",
		icon: User,
	},
	{
		title: "Settings",
		url: "#",
		icon: Settings,
	},
];
</script>

<template>
	<Sidebar>
		<SidebarContent>
			<SidebarGroup>
				<SidebarGroupLabel>Application</SidebarGroupLabel>
				<SidebarGroupContent>
					<SidebarMenu>
						<SidebarMenuItem
							v-for="item in items"
							:key="item.title"
						>
							<SidebarMenuButton asChild>
								<a :href="item.url">
									<component :is="item.icon" />
									<span>{{ item.title }}</span>
								</a>
							</SidebarMenuButton>
						</SidebarMenuItem>
					</SidebarMenu>
				</SidebarGroupContent>
			</SidebarGroup>
		</SidebarContent>
	</Sidebar>
</template>
