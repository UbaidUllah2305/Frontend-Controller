import * as React from 'react';
import {
  Box,
  ChevronRight,
  GalleryVerticalEnd,
  Layers2,
  Layers3,
  LucideIcon,
  NotebookTabs,
  PanelLeftDashed,
  UsersRound,
} from 'lucide-react';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { NavUser } from '@/components/SideBar/nav-user';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarRail,
} from '@/components/ui/sidebar';
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import { Link } from 'react-router-dom';
import { useAppSelector } from '@/store';
import { User } from '@/types/user';
import CommandBox from './command-box';

type SideBarRoutedItem = {
  title: string;
  url: string;
  icon: LucideIcon;
  slug: string;
  type: 'routed';
};

type DropdownItem = {
  title: string;
  url: string;
  slug: string;
  icon: LucideIcon;
  type: 'dropdown';
  items?: SideBarRoutedItem[];
};

const sideBarlinks: (DropdownItem | SideBarRoutedItem)[] = [
  {
    title: 'Dashboard',
    type: 'routed',
    url: '/',
    slug: '/',
    icon: PanelLeftDashed,
  },
  {
    title: 'Vendors',
    type: 'routed',
    url: '/clients',
    slug: 'clients',
    icon: UsersRound,
  },
  {
    title: 'Catalog',
    type: 'dropdown',
    slug: 'catalog',
    url: '#',
    icon: NotebookTabs,
    items: [
      {
        title: 'Categories',
        slug: 'categories',
        url: '/catalog/categories',
        type: 'routed',
        icon: Layers2,
      },
      {
        title: 'Sub Categories',
        slug: 'sub-categories',
        url: '/catalog/sub-categories',
        type: 'routed',
        icon: Layers3,
      },
      {
        title: 'Products',
        slug: 'products',
        url: '/catalog/products',
        type: 'routed',
        icon: Box,
      },
    ],
  },
];

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const firstIndex = location.pathname.split('/')[1] || '/';
  const { firstName, email, image } = useAppSelector((state) => state.auth.user) as User;
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              variant={'outline'}
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                <GalleryVerticalEnd className="size-4" />
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">SYMS</span>
                <span className="truncate text-xs">Controller</span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
        <CommandBox />
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup className="px-2">
          <SidebarMenu className="gap-2">
            <SidebarMenuItem>
              <SidebarMenuButton className="font-medium">
                Navigation
              </SidebarMenuButton>
              <SidebarMenuSub className="ml-0 border-l-0 px-1.5">
                {sideBarlinks.map((item) =>
                  item.type === 'routed' ? (
                    <SidebarMenuSubItem key={item.title}>
                      <SidebarMenuButton
                        tooltip={item.title}
                      // isActive={item.slug == firstIndex}
                      >
                        <Link
                          to={item.url}
                          className="flex w-full items-center gap-2"
                        >
                          {item.icon && <item.icon className="w-4 h-4" />}
                          <span>{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuSubItem>
                  ) : (
                    <Collapsible
                      key={item.title}
                      asChild
                      defaultOpen={item.slug == firstIndex}
                      className="group/collapsible"
                    >
                      <SidebarMenuItem>
                        <CollapsibleTrigger asChild>
                          <SidebarMenuButton tooltip={item.title}>
                            {item.icon && <item.icon />}
                            <span>{item.title}</span>
                            <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                          </SidebarMenuButton>
                        </CollapsibleTrigger>
                        <CollapsibleContent>
                          <SidebarMenuSub className="gap-2">
                            {item.items?.map((subItem) => (
                              <SidebarMenuSubItem key={subItem.title}>
                                <SidebarMenuSubButton
                                  asChild
                                // isActive={subItem.slug == lastIndex}
                                >
                                  <Link to={subItem.url}>
                                    <>
                                      {subItem.icon && (
                                        <subItem.icon className="w-4 h-4" />
                                      )}

                                      <span>{subItem.title}</span>
                                    </>
                                  </Link>
                                </SidebarMenuSubButton>
                              </SidebarMenuSubItem>
                            ))}
                          </SidebarMenuSub>
                        </CollapsibleContent>
                      </SidebarMenuItem>
                    </Collapsible>
                  ),
                )}
              </SidebarMenuSub>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <NavUser
          user={{
            name: firstName,
            email: email,
            avatar: image,
          }}
        />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
