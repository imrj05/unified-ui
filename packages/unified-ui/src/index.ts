// ============================================================================
// Unified UI — Design System Entry Point
// ============================================================================
// Unified UI is a token-driven design system for React applications built
// with Next.js, Tailwind CSS v4, and Framer Motion. This is the single
// top-level entry point — all tokens, theme utilities, primitives,
// components, motion presets, and utility functions are re-exported here.
//
// Recommended import patterns:
//
//   // Import specific items from the top level
//   import { Button, Stack, fadeIn, cn } from "@/design-system";
//
//   // Or import from specific sublayers for clarity in larger files
//   import { spacing, radius } from "@/design-system/tokens";
//   import { DSThemeProvider } from "@/design-system/theme";
//   import { Typography, Heading } from "@/design-system/primitives";
//   import { Button } from "@/design-system/components";
//   import { slideUp, motionProps } from "@/design-system/motion";
//
// CSS custom properties use plain `--` prefix with no namespace infix
// (e.g. `--radius-md`, `--shadow-lg`, `--duration-fast`).
//
// @see https://github.com/rajeshwar/unified-ui
// ============================================================================

/** Current version of the Unified UI design system. */
export const UNIFIED_UI_VERSION = "0.3.7" as const;

export {
  Accordion,
  AccordionContent,
  type AccordionContentProps,
  AccordionItem,
  type AccordionItemProps,
  type AccordionMultipleProps,
  type AccordionProps,
  type AccordionSingleProps,
  type AccordionSize,
  AccordionTrigger,
  type AccordionTriggerProps,
  type AccordionVariant,
  accordionRootVariants,
  accordionTriggerVariants,
} from "./components/accordion";
export {
  Alert,
  type AlertProps,
  type AlertVariant,
  alertVariants,
  // Callout — backward-compatible alias (merged into Alert)
  Callout,
  type CalloutProps,
  type CalloutVariant,
  calloutVariants,
} from "./components/alert";
// ---------------------------------------------------------------------------
// Phase 10 — Extended Components
// ---------------------------------------------------------------------------
export {
  AlertDialog,
  AlertDialogAction,
  type AlertDialogActionProps,
  AlertDialogCancel,
  type AlertDialogCancelProps,
  AlertDialogContent,
  type AlertDialogContentProps,
  AlertDialogDescription,
  type AlertDialogDescriptionProps,
  AlertDialogFooter,
  type AlertDialogFooterProps,
  AlertDialogHeader,
  type AlertDialogHeaderProps,
  AlertDialogOverlay,
  type AlertDialogOverlayProps,
  AlertDialogPortal,
  AlertDialogTitle,
  type AlertDialogTitleProps,
  AlertDialogTrigger,
} from "./components/alert-dialog";
export { AspectRatio, type AspectRatioProps } from "./components/aspect-ratio";
export {
  Avatar,
  AvatarGroup,
  type AvatarGroupProps,
  type AvatarProps,
  type AvatarShape,
  type AvatarSize,
  type AvatarStatus,
  avatarVariants,
} from "./components/avatar";
export {
  Badge,
  type BadgeProps,
  type BadgeSize,
  type BadgeVariant,
  badgeVariants,
  // Tag — backward-compatible alias (merged into Badge)
  Tag,
  type TagProps,
  type TagSize,
  type TagVariant,
  tagVariants,
} from "./components/badge";
export {
  Banner,
  type BannerPosition,
  type BannerProps,
  type BannerVariant,
  bannerVariants,
} from "./components/banner";
export {
  Breadcrumb,
  BreadcrumbEllipsis,
  type BreadcrumbEllipsisProps,
  BreadcrumbItem,
  type BreadcrumbItemProps,
  BreadcrumbLink,
  type BreadcrumbLinkProps,
  BreadcrumbList,
  type BreadcrumbListProps,
  BreadcrumbNav,
  type BreadcrumbNavItem,
  type BreadcrumbNavProps,
  BreadcrumbPage,
  type BreadcrumbPageProps,
  type BreadcrumbProps,
  BreadcrumbSeparator,
  type BreadcrumbSeparatorProps,
} from "./components/breadcrumb";
// ---------------------------------------------------------------------------
// Layer 4: Composite Components
// ---------------------------------------------------------------------------
// Higher-level Unified UI components built from primitives. These implement
// complex interaction patterns, accessibility requirements, and visual
// design rules.
// ---------------------------------------------------------------------------
export {
  Button,
  type ButtonProps,
  type ButtonSize,
  type ButtonVariant,
  buttonVariants,
} from "./components/button";
export {
  Calendar,
  type CalendarMode,
  type CalendarProps,
  calendarDayVariants,
  type DateRange,
} from "./components/calendar";
// Callout is now re-exported from "./components/alert" above (merged into Alert)
export {
  Card,
  CardBody,
  type CardBodyProps,
  CardFooter,
  type CardFooterProps,
  CardHeader,
  type CardHeaderProps,
  type CardProps,
  type CardVariant,
  cardVariants,
} from "./components/card";
export {
  Carousel,
  type CarouselProps,
  useCarouselContext,
} from "./components/carousel";
// ---------------------------------------------------------------------------
// Chart
// ---------------------------------------------------------------------------
export {
  ChartContainer,
  type ChartContainerProps,
  ChartTooltipContent,
  type ChartTooltipContentProps,
  chartColors,
} from "./components/chart";
export {
  Checkbox,
  CheckboxGroup,
  type CheckboxGroupOrientation,
  type CheckboxGroupProps,
  type CheckboxProps,
  type CheckboxSize,
  checkboxVariants,
  useCheckboxGroupContext,
} from "./components/checkbox";
export {
  CodeBlock,
  type CodeBlockProps,
  type CodeVariant,
  codeBlockVariants,
  InlineCode as CodeInline,
  type InlineCodeProps as CodeInlineProps,
  inlineCodeVariants,
} from "./components/code";
// ---------------------------------------------------------------------------
// Collapsible
// ---------------------------------------------------------------------------
export {
  Collapsible,
  CollapsibleContent,
  type CollapsibleContentProps,
  type CollapsibleProps,
  CollapsibleTrigger,
  type CollapsibleTriggerProps,
  useCollapsibleContext,
} from "./components/collapsible";
// ---------------------------------------------------------------------------
// ColorPicker
// ---------------------------------------------------------------------------
export {
  ColorPicker,
  type ColorPickerProps,
} from "./components/color-picker";
export {
  Combobox,
  type ComboboxGroup,
  type ComboboxOption,
  type ComboboxProps,
  type ComboboxSize,
  type ComboboxVariant,
  comboboxTriggerVariants,
} from "./components/combobox";
// ---------------------------------------------------------------------------
// Command
// ---------------------------------------------------------------------------
export {
  Command,
  type CommandGroup,
  type CommandItem,
  type CommandProps,
  CommandTrigger,
  type CommandTriggerProps,
} from "./components/command";
export {
  ConfirmDialog,
  type ConfirmDialogProps,
  type ConfirmDialogVariant,
} from "./components/confirm-dialog";
// ---------------------------------------------------------------------------
// ContextMenu
// ---------------------------------------------------------------------------
export {
  ContextMenu,
  ContextMenuCheckboxItem,
  type ContextMenuCheckboxItemProps,
  ContextMenuContent,
  type ContextMenuContentProps,
  ContextMenuGroup,
  type ContextMenuGroupProps,
  ContextMenuItem,
  type ContextMenuItemProps,
  type ContextMenuItemVariant,
  ContextMenuLabel,
  type ContextMenuLabelProps,
  type ContextMenuProps,
  ContextMenuRadioGroup,
  type ContextMenuRadioGroupProps,
  ContextMenuRadioItem,
  type ContextMenuRadioItemProps,
  ContextMenuSeparator,
  type ContextMenuSeparatorProps,
  ContextMenuShortcut,
  type ContextMenuShortcutProps,
  ContextMenuSub,
  ContextMenuSubContent,
  type ContextMenuSubContentProps,
  type ContextMenuSubProps,
  ContextMenuSubTrigger,
  type ContextMenuSubTriggerProps,
  ContextMenuTrigger,
  type ContextMenuTriggerProps,
} from "./components/context-menu";
export {
  CopyButton,
  type CopyButtonProps,
  type CopyButtonSize,
  type CopyButtonVariant,
  copyButtonVariants,
} from "./components/copy-button";
export {
  DataList,
  DataListDetail,
  type DataListDetailProps,
  type DataListItem,
  type DataListOrientation,
  type DataListProps,
  type DataListSize,
  DataListTerm,
  type DataListTermProps,
  dataListVariants,
} from "./components/data-list";
// ---------------------------------------------------------------------------
// DataTable (TanStack Table powered)
// ---------------------------------------------------------------------------
export {
  type ColumnDef,
  type ColumnFiltersState,
  createColumnHelper,
  DataTable,
  type DataTableColumnMeta,
  type DataTableFacetedFilter,
  type DataTableProps,
  type PaginationState,
  type Row,
  type RowSelectionState,
  type SortingState,
  type UseDataTableOptions,
  type UseDataTableReturn,
  useDataTable,
  type VisibilityState,
} from "./components/data-table";
// ---------------------------------------------------------------------------
// DataTableToolbar
// ---------------------------------------------------------------------------
export {
  type ColumnVisibility,
  type DataTableFilter,
  DataTableToolbar,
  type DataTableToolbarProps,
  type ViewMode,
} from "./components/data-table-toolbar";
export {
  DatePicker,
  type DatePickerMode,
  type DatePickerProps,
  type DatePickerSize,
} from "./components/date-picker";
export {
  Dialog,
  DialogBody,
  type DialogBodyProps,
  DialogClose,
  type DialogCloseProps,
  DialogContent,
  type DialogContentProps,
  DialogDescription,
  type DialogDescriptionProps,
  DialogFooter,
  type DialogFooterProps,
  DialogHeader,
  type DialogHeaderProps,
  type DialogProps,
  type DialogSize,
  DialogTitle,
  type DialogTitleProps,
  DialogTrigger,
  type DialogTriggerProps,
  dialogContentVariants,
} from "./components/dialog";
export {
  Drawer,
  DrawerBody,
  type DrawerBodyProps,
  DrawerClose,
  type DrawerCloseProps,
  DrawerContent,
  type DrawerContentProps,
  DrawerDescription,
  type DrawerDescriptionProps,
  DrawerFooter,
  type DrawerFooterProps,
  DrawerHandle,
  type DrawerHandleProps,
  DrawerHeader,
  type DrawerHeaderProps,
  type DrawerProps,
  type DrawerSize,
  DrawerTitle,
  type DrawerTitleProps,
  DrawerTrigger,
  type DrawerTriggerProps,
  drawerContentVariants,
} from "./components/drawer";
export {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  type DropdownMenuCheckboxItemProps,
  DropdownMenuContent,
  type DropdownMenuContentProps,
  DropdownMenuGroup,
  type DropdownMenuGroupProps,
  DropdownMenuItem,
  type DropdownMenuItemProps,
  type DropdownMenuItemVariant,
  DropdownMenuLabel,
  type DropdownMenuLabelProps,
  type DropdownMenuProps,
  DropdownMenuRadioGroup,
  type DropdownMenuRadioGroupProps,
  DropdownMenuRadioItem,
  type DropdownMenuRadioItemProps,
  DropdownMenuSeparator,
  type DropdownMenuSeparatorProps,
  DropdownMenuShortcut,
  type DropdownMenuShortcutProps,
  DropdownMenuSub,
  DropdownMenuSubContent,
  type DropdownMenuSubContentProps,
  type DropdownMenuSubProps,
  DropdownMenuSubTrigger,
  type DropdownMenuSubTriggerProps,
  DropdownMenuTrigger,
  type DropdownMenuTriggerProps,
} from "./components/dropdown-menu";
export { EmptyState, type EmptyStateProps } from "./components/empty-state";
export {
  FileUpload,
  type FileUploadItem,
  type FileUploadProps,
  type FileUploadSize,
  fileUploadZoneVariants,
} from "./components/file-upload";
// ---------------------------------------------------------------------------
// FormField
// ---------------------------------------------------------------------------
export {
  FormField,
  type FormFieldControlProps,
  type FormFieldOrientation,
  type FormFieldProps,
  type FormFieldSize,
} from "./components/form-field";
export {
  HoverCard,
  HoverCardContent,
  type HoverCardContentProps,
  type HoverCardProps,
  HoverCardTrigger,
  type HoverCardTriggerProps,
} from "./components/hover-card";
// ---------------------------------------------------------------------------
// ImageGallery
// ---------------------------------------------------------------------------
export {
  type GalleryImage,
  ImageGallery,
  type ImageGalleryProps,
} from "./components/image-gallery";
// ---------------------------------------------------------------------------
// InfiniteScroll
// ---------------------------------------------------------------------------
export {
  InfiniteScroll,
  type InfiniteScrollProps,
} from "./components/infinite-scroll";
export {
  Input,
  type InputProps,
  type InputSize,
  type InputVariant,
  inputVariants,
} from "./components/input";
export {
  InputGroup,
  type InputGroupProps,
  type InputGroupSize,
  type InputGroupVariant,
} from "./components/input-group";
export {
  Kbd,
  type KbdProps,
  type KbdSize,
  kbdVariants,
} from "./components/kbd";
// ---------------------------------------------------------------------------
// FormLabel (component-layer Label — distinct from primitives/typography Label)
// ---------------------------------------------------------------------------
export {
  Label as FormLabel,
  type LabelProps as FormLabelProps,
  type LabelSize as FormLabelSize,
  labelVariants as formLabelVariants,
} from "./components/label";
// ---------------------------------------------------------------------------
// Markdown
// ---------------------------------------------------------------------------
export {
  Markdown,
  type MarkdownProps,
} from "./components/markdown";
// ---------------------------------------------------------------------------
// Menubar
// ---------------------------------------------------------------------------
export {
  Menubar,
  MenubarCheckboxItem,
  type MenubarCheckboxItemProps,
  MenubarContent,
  type MenubarContentProps,
  MenubarGroup,
  type MenubarGroupProps,
  MenubarItem,
  type MenubarItemProps,
  type MenubarItemVariant,
  MenubarLabel,
  type MenubarLabelProps,
  MenubarMenu,
  type MenubarMenuProps,
  type MenubarProps,
  MenubarRadioGroup,
  type MenubarRadioGroupProps,
  MenubarRadioItem,
  type MenubarRadioItemProps,
  MenubarSeparator,
  type MenubarSeparatorProps,
  MenubarShortcut,
  type MenubarShortcutProps,
  MenubarSub,
  MenubarSubContent,
  type MenubarSubContentProps,
  type MenubarSubProps,
  MenubarSubTrigger,
  type MenubarSubTriggerProps,
  MenubarTrigger,
  type MenubarTriggerProps,
} from "./components/menubar";
// ---------------------------------------------------------------------------
// NavigationMenu
// ---------------------------------------------------------------------------
export {
  NavigationMenu,
  NavigationMenuCardLink,
  type NavigationMenuCardLinkProps,
  NavigationMenuContent,
  type NavigationMenuContentProps,
  NavigationMenuIndicator,
  type NavigationMenuIndicatorProps,
  NavigationMenuItem,
  type NavigationMenuItemProps,
  NavigationMenuLink,
  type NavigationMenuLinkProps,
  NavigationMenuList,
  type NavigationMenuListProps,
  type NavigationMenuProps,
  NavigationMenuTrigger,
  type NavigationMenuTriggerProps,
  NavigationMenuViewport,
  type NavigationMenuViewportProps,
} from "./components/navigation-menu";
export {
  NumberInput,
  type NumberInputProps,
  type NumberInputSize,
  type NumberInputVariant,
  numberInputVariants,
} from "./components/number-input";
export {
  Pagination,
  type PaginationProps,
  type PaginationSize,
  type PaginationVariant,
  paginationButtonVariants,
} from "./components/pagination";
export {
  PinInput,
  type PinInputProps,
  type PinInputSize,
  type PinInputType,
  type PinInputVariant,
  pinCellVariants,
} from "./components/pin-input";
export {
  Popover,
  PopoverArrow,
  type PopoverArrowProps,
  PopoverClose,
  type PopoverCloseProps,
  PopoverContent,
  type PopoverContentProps,
  type PopoverProps,
  PopoverTrigger,
  type PopoverTriggerProps,
} from "./components/popover";
// ---------------------------------------------------------------------------
// Progress
// ---------------------------------------------------------------------------
export {
  Progress,
  type ProgressProps,
  type ProgressSize,
  type ProgressVariant,
  progressIndicatorVariants,
  progressTrackVariants,
} from "./components/progress";
export {
  RadioCard,
  type RadioCardProps,
  RadioGroup,
  RadioGroupItem,
  type RadioGroupItemProps,
  type RadioGroupProps,
  type RadioOrientation,
  type RadioSize,
  radioCardVariants,
  radioGroupVariants,
  radioIndicatorVariants,
} from "./components/radio";
export {
  ResizableHandle,
  type ResizableHandleProps,
  ResizablePanel,
  ResizablePanelGroup,
  type ResizablePanelGroupProps,
  type ResizablePanelProps,
} from "./components/resizable";
// ---------------------------------------------------------------------------
// ScrollArea
// ---------------------------------------------------------------------------
export {
  ScrollArea,
  type ScrollAreaProps,
  type ScrollAreaType,
  ScrollBar,
  type ScrollBarOrientation,
  type ScrollBarProps,
  type ScrollBarSize,
  scrollbarThumbVariants,
  scrollbarVariants,
} from "./components/scroll-area";
export {
  SearchInput,
  type SearchInputProps,
  type SearchInputSize,
  type SearchInputVariant,
  searchInputVariants,
} from "./components/search-input";
export {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectScrollDownButton,
  SelectScrollUpButton,
  SelectSeparator,
  type SelectSize,
  SelectTrigger,
  SelectValue,
  type SelectVariant,
  selectTriggerVariants,
} from "./components/select";
export {
  Separator,
  type SeparatorOrientation,
  type SeparatorProps,
  type SeparatorSpacing,
  type SeparatorVariant,
  separatorVariants,
} from "./components/separator";
export {
  Sheet,
  SheetClose,
  type SheetCloseProps,
  SheetContent,
  type SheetContentProps,
  SheetDescription,
  type SheetDescriptionProps,
  SheetFooter,
  type SheetFooterProps,
  SheetHeader,
  type SheetHeaderProps,
  type SheetProps,
  type SheetSide,
  type SheetSize,
  SheetTitle,
  type SheetTitleProps,
  SheetTrigger,
  type SheetTriggerProps,
  sheetContentVariants,
} from "./components/sheet";
export {
  Sidebar,
  type SidebarCollapsible,
  SidebarContent,
  type SidebarContentProps,
  SidebarFooter,
  type SidebarFooterProps,
  SidebarGroup,
  SidebarGroupAction,
  type SidebarGroupActionProps,
  SidebarGroupContent,
  type SidebarGroupContentProps,
  SidebarGroupLabel,
  type SidebarGroupLabelProps,
  type SidebarGroupProps,
  SidebarHeader,
  type SidebarHeaderProps,
  SidebarInput,
  type SidebarInputProps,
  SidebarInset,
  type SidebarInsetProps,
  SidebarItem,
  type SidebarItemProps,
  SidebarMenu,
  SidebarMenuAction,
  type SidebarMenuActionProps,
  SidebarMenuBadge,
  type SidebarMenuBadgeProps,
  SidebarMenuButton,
  type SidebarMenuButtonProps,
  type SidebarMenuButtonSize,
  type SidebarMenuButtonVariant,
  SidebarMenuItem,
  type SidebarMenuItemProps,
  type SidebarMenuProps,
  SidebarMenuSkeleton,
  type SidebarMenuSkeletonProps,
  SidebarMenuSub,
  SidebarMenuSubButton,
  type SidebarMenuSubButtonProps,
  SidebarMenuSubItem,
  type SidebarMenuSubItemProps,
  type SidebarMenuSubProps,
  SidebarMobileOverlay,
  type SidebarMobileOverlayProps,
  type SidebarProps,
  SidebarProvider,
  type SidebarProviderProps,
  SidebarRail,
  type SidebarRailProps,
  SidebarSection,
  type SidebarSectionProps,
  SidebarSeparator,
  type SidebarSeparatorProps,
  type SidebarSide,
  SidebarToggle,
  type SidebarToggleProps,
  SidebarTrigger,
  type SidebarTriggerProps,
  type SidebarVariant,
  useSidebar,
  useSidebarContext,
} from "./components/sidebar";
export {
  Skeleton,
  SkeletonCircle,
  type SkeletonCircleProps,
  type SkeletonProps,
  SkeletonRect,
  type SkeletonRectProps,
  type SkeletonSize,
  SkeletonText,
  type SkeletonTextProps,
  type SkeletonTextSize,
  skeletonVariants,
} from "./components/skeleton";
export {
  Slider,
  type SliderMark,
  type SliderOrientation,
  type SliderProps,
  type SliderSize,
  type SliderVariant,
  sliderRangeVariants,
  sliderThumbVariants,
  sliderTrackVariants,
} from "./components/slider";
// ---------------------------------------------------------------------------
// Sonner (Toast via sonner)
// ---------------------------------------------------------------------------
export {
  type SonnerPosition,
  SonnerToaster,
  type SonnerToasterProps,
  type SonnerToastOptions,
  toast,
} from "./components/sonner";
// ---------------------------------------------------------------------------
// Spinner
// ---------------------------------------------------------------------------
export {
  Spinner,
  type SpinnerProps,
  type SpinnerSize,
  type SpinnerVariant,
  spinnerVariants,
} from "./components/spinner";
export {
  Stat,
  type StatProps,
  type StatTrend,
  statVariants,
} from "./components/stat";
// ---------------------------------------------------------------------------
// Steps
// ---------------------------------------------------------------------------
export {
  Step,
  type StepProps,
  type StepStatus,
  Steps,
  type StepsOrientation,
  type StepsProps,
  type StepsVariant,
} from "./components/steps";
export {
  Switch,
  type SwitchLabelPosition,
  type SwitchProps,
  type SwitchSize,
  switchThumbVariants,
  switchTrackVariants,
} from "./components/switch";
export {
  Table,
  type TableAlign,
  TableBody,
  type TableBodyProps,
  TableCaption,
  type TableCaptionProps,
  TableCell,
  type TableCellProps,
  type TableDensity,
  TableFooter,
  type TableFooterProps,
  TableHead,
  TableHeader,
  type TableHeaderProps,
  type TableHeadProps,
  type TableProps,
  TableRow,
  type TableRowProps,
  type TableSortDirection,
  tableRootVariants,
} from "./components/table";
export {
  Tabs,
  TabsContent,
  type TabsContentProps,
  TabsList,
  type TabsListProps,
  type TabsOrientation,
  type TabsProps,
  type TabsSize,
  TabsTrigger,
  type TabsTriggerProps,
  type TabsVariant,
  tabsListVariants,
  tabsTriggerVariants,
} from "./components/tabs";
// Tag is now re-exported from "./components/badge" above (merged into Badge)
export {
  Textarea,
  type TextareaProps,
  type TextareaSize,
  type TextareaVariant,
  textareaVariants,
} from "./components/textarea";
export {
  ThemeToggle,
  type ThemeToggleMode,
  type ThemeToggleProps,
  type ThemeToggleSize,
  type ThemeToggleVariant,
  type ThemeValue,
} from "./components/theme-toggle";
export {
  Timeline,
  type TimelineAlign,
  TimelineItem,
  type TimelineItemData,
  type TimelineItemProps,
  type TimelineItemStatus,
  type TimelineProps,
  type TimelineSize,
  type TimelineVariant,
} from "./components/timeline";
export {
  type ToastAction,
  type ToastAPI,
  type ToastData,
  ToastItem,
  type ToastItemProps,
  type ToastOptions,
  type ToastPosition,
  ToastProvider,
  type ToastProviderProps,
  type ToastVariant,
  toastVariants,
  useToast,
} from "./components/toast";
// ---------------------------------------------------------------------------
// Toggle
// ---------------------------------------------------------------------------
export {
  Toggle,
  type ToggleProps,
  type ToggleSize,
  type ToggleVariant,
  toggleVariants,
} from "./components/toggle";
// ---------------------------------------------------------------------------
// ToggleGroup
// ---------------------------------------------------------------------------
export {
  ToggleGroup,
  ToggleGroupItem,
  type ToggleGroupItemProps,
  type ToggleGroupMultipleProps,
  type ToggleGroupOrientation,
  type ToggleGroupProps,
  type ToggleGroupSingleProps,
  type ToggleGroupSize,
  type ToggleGroupVariant,
  toggleGroupItemVariants,
  toggleGroupVariants,
  useToggleGroupContext,
} from "./components/toggle-group";
export {
  Tooltip,
  type TooltipAlign,
  type TooltipProps,
  TooltipProvider,
  type TooltipProviderProps,
  type TooltipSide,
} from "./components/tooltip";
// ---------------------------------------------------------------------------
// TreeView
// ---------------------------------------------------------------------------
export {
  type TreeCheckedState,
  type TreeNode,
  TreeView,
  type TreeViewProps,
} from "./components/tree-view";
// ---------------------------------------------------------------------------
// VideoPlayer
// ---------------------------------------------------------------------------
export {
  VideoPlayer,
  type VideoPlayerProps,
} from "./components/video-player";
// ---------------------------------------------------------------------------
// VirtualList
// ---------------------------------------------------------------------------
export {
  VirtualList,
  type VirtualListProps,
} from "./components/virtual-list";
export {
  VisuallyHidden,
  type VisuallyHiddenProps,
} from "./components/visually-hidden";
// ---------------------------------------------------------------------------
// Layer 5: Motion System
// ---------------------------------------------------------------------------
// Framer Motion animation presets and utilities built on top of the Unified
// UI motion tokens. Provides a consistent motion language across the
// application.
// ---------------------------------------------------------------------------
export {
  // Blur
  blurIn,
  blurInSubtle,
  // Expand / Collapse
  expandHeight,
  expandHeightSlow,
  // Fade presets
  fadeIn,
  fadeInFast,
  fadeInSlow,
  hoverLift,
  hoverScale,
  // Motion types
  type MotionPreset,
  type MotionPropsResult,
  // Motion hooks & runtime utilities
  MotionSafe,
  type MotionSafeProps,
  modalContent,
  modalContentSpring,
  // Spread helper
  motionProps,
  // Overlay / Modal / Toast
  overlayBackdrop,
  // Pop / Emphasis
  pop,
  popSubtle,
  // Micro-interactions
  press,
  // Loading states
  pulse,
  // Reduced motion utilities
  reduceMotion,
  type SpringConfig,
  // Scale presets
  scaleIn,
  scaleInLg,
  scaleInSpring,
  slideDown,
  slideDownSm,
  slideInFromBottom,
  slideInFromLeft,
  slideInFromRight,
  // Slide horizontal
  slideLeft,
  slideRight,
  // Slide vertical
  slideUp,
  slideUpLg,
  slideUpSm,
  slideUpSpring,
  spin,
  // Stagger containers
  staggerContainer,
  staggerContainerFast,
  staggerContainerSlow,
  tapScale,
  toastSlideIn,
  toastSlideUp,
  useMotion,
  useMotionProps,
  useMotionSpringConfig,
  useReducedMotion,
  withReducedMotion,
} from "./motion";
// ---------------------------------------------------------------------------
// Phase 11 — New motion presets (re-exported from motion layer)
// ---------------------------------------------------------------------------
export {
  countUp,
  crossfade,
  dragDismiss,
  numberRoll,
  revealMask,
  shakeX,
  slidePanelBottom,
  slidePanelLeft,
  slidePanelRight,
  slidePanelTop,
  springHover,
  springPress,
} from "./motion/presets";
// ---------------------------------------------------------------------------
// Layer 3: Primitive Components
// ---------------------------------------------------------------------------
// Foundational Unified UI building blocks — typography, layout, and
// structural elements. These are the lowest-level components that composite
// components are built from. They consume design tokens via Tailwind utilities.
// ---------------------------------------------------------------------------
export {
  Body,
  type BodyProps,
  Caption,
  type CaptionProps,
  // Layout
  Container,
  type ContainerPadding,
  type ContainerProps,
  type ContainerSize,
  Divider,
  type DividerProps,
  Grid,
  type GridProps,
  Heading,
  type HeadingComponentProps,
  type HeadingProps,
  InlineCode,
  type InlineCodeProps,
  Label,
  type LabelProps,
  Overline,
  type OverlineProps,
  Stack,
  type StackAlign,
  type StackDirection,
  type StackJustify,
  type StackProps,
  Subheading,
  type SubheadingProps,
  // Typography
  Typography,
  type TypographyAlign,
  type TypographyColor,
  // Primitive types
  type TypographyFont,
  type TypographyOwnProps,
  type TypographyProps,
  type TypographyVariant,
} from "./primitives";
// ---------------------------------------------------------------------------
// Layer 2: Theme System
// ---------------------------------------------------------------------------
// CSS variable contract, theme provider, and theme toggle hook.
// The theme layer bridges Unified UI tokens to runtime by mapping them to
// CSS custom properties and providing React context for theme-aware
// components.
// ---------------------------------------------------------------------------
export {
  buildDarkThemeVars,
  buildLightThemeVars,
  buildThemeCSS,
  // Theme Presets & Configuration
  buildThemeOverrides,
  COLOR_PRESET_KEYS,
  COLOR_PRESETS,
  type ColorPreset,
  type ColorPresetKey,
  type ColorVarName,
  // Theme contract & CSS variable utilities
  contract,
  cssVar,
  DEFAULT_FONT_KEY,
  DEFAULT_MENU_ACCENT_KEY,
  DEFAULT_MENU_COLOR_KEY,
  DEFAULT_RADIUS_KEY,
  DEFAULT_SHADOW_KEY,
  DEFAULT_STYLE_KEY,
  DEFAULT_SURFACE_STYLE_KEY,
  DEFAULT_THEME_CONFIG,
  type DSThemeContextValue,
  // Theme provider & hook
  DSThemeProvider,
  type DSThemeProviderProps,
  type DurationVarName,
  type EasingVarName,
  FONT_PRESETS,
  type FontFamilyVarName,
  type FontPreset,
  generateThemeCSS,
  getColorPreset,
  getFontPreset,
  getMenuAccentPreset,
  getMenuColorPreset,
  getRadiusPreset,
  getShadowPreset,
  getStylePreset,
  MENU_ACCENT_PRESETS,
  MENU_COLOR_PRESETS,
  type MenuAccentPreset,
  type MenuColorPreset,
  type PresetSemanticColors,
  RADIUS_PRESETS,
  type RadiusPreset,
  type RadiusVarName,
  type ResolvedTheme,
  SHADOW_PRESETS,
  type ShadowPreset,
  type ShadowVarName,
  STYLE_PRESETS,
  type StylePreset,
  SURFACE_STYLE_PRESETS,
  type SurfaceStylePreset,
  type ThemeConfig,
  // Theme Customizer UI Component
  ThemeCustomizer,
  // Theme Customizer Store (Context + Provider + Hook)
  type ThemeCustomizerContextValue,
  type ThemeCustomizerProps,
  ThemeCustomizerProvider,
  type ThemeCustomizerProviderProps,
  // Theme types
  type ThemeMode,
  type ThemeVars,
  useDSTheme,
  useThemeCustomizer,
  type ZIndexVarName,
} from "./theme";
// ---------------------------------------------------------------------------
// Layer 1: Design Tokens
// ---------------------------------------------------------------------------
// Raw design values — colors, spacing, typography, radius, shadows, z-index,
// and motion timing. These are the single source of truth for all visual
// properties in the Unified UI system.
// ---------------------------------------------------------------------------
export {
  amber,
  blue,
  brand,
  // Token types
  type ColorScale,
  type Duration,
  // Motion tokens
  duration,
  durationCSS,
  durationSeconds,
  type Easing,
  easing,
  easingCSS,
  type FontFamily,
  type FontFamilyKey,
  type FontSize,
  type FontWeight,
  // Typography tokens
  fontFamily,
  fontSize,
  fontWeight,
  gray,
  green,
  type LetterSpacing,
  type LineHeight,
  letterSpacing,
  lineHeight,
  neutral,
  palettes,
  pure,
  type Radius,
  type RadiusValue,
  // Radius
  radius,
  red,
  type SemanticColorKey,
  type SemanticColors,
  type Shadow,
  type ShadowValue,
  type Spring,
  type Stagger,
  semanticDark,
  semanticLight,
  // Shadows
  shadow,
  shadowDark,
  // Color palettes
  slate,
  // Spacing
  spacing,
  spring,
  stagger,
  type TypographyPreset,
  type TypographyVariant as TypographyVariantToken,
  teal,
  typographyVariants,
  type ZIndex,
  type ZIndexValue,
  // Z-Index
  zIndex,
  zinc,
} from "./tokens";
// ---------------------------------------------------------------------------
// Layer 6: Utilities
// ---------------------------------------------------------------------------
// Shared utility functions and types used across the Unified UI design
// system.
// ---------------------------------------------------------------------------
export {
  type AsProp,
  cn,
  composeRefs,
  dsAttr,
  dsColorVar,
  dsStateAttr,
  dsVar,
  mergeSlots,
  noop,
  type PolymorphicProps,
  type PolymorphicPropsWithRef,
  type PolymorphicRef,
  type SlotClasses,
  typedKeys,
} from "./utils/cn";
// ---------------------------------------------------------------------------
// Layer 8: WCAG Contrast Checking Utilities
// ---------------------------------------------------------------------------
export {
  type AuditResult,
  auditContrast,
  type ColorPair,
  type ContrastResult,
  checkDSContrast,
  checkHexContrast,
  contrastRatio,
  DS_DARK_CRITICAL_PAIRS,
  DS_LIGHT_CRITICAL_PAIRS,
  meetsAA,
  meetsAAA,
  meetsNonTextAA,
  parseHex,
  parseRGBString,
  type RGB,
  relativeLuminance,
  type TextSize,
  toRGBString,
  WCAG_AA_LARGE,
  WCAG_AA_NORMAL,
  WCAG_AAA_LARGE,
  WCAG_AAA_NORMAL,
  WCAG_NON_TEXT_AA,
} from "./utils/contrast";
// ---------------------------------------------------------------------------
// Layer 7: Focus Ring Utilities
// ---------------------------------------------------------------------------
export {
  type FocusRingVariant,
  focusRingClasses,
  focusRingClassList,
  focusRingCompactClasses,
  focusRingCompactClassList,
  focusRingGroupRingClasses,
  focusRingGroupTriggerClasses,
  focusRingInsetClasses,
  focusRingInsetClassList,
  focusRingVariantOverrides,
  focusWithinRingClasses,
  focusWithinRingClassList,
} from "./utils/focus-ring";
export {
  type ChildrenProps,
  type ComponentIntent,
  type ComponentSize,
  dsDataAttrs,
  type OptionalChildrenProps,
  type SlotConfig,
  type Slots,
} from "./utils/types";
