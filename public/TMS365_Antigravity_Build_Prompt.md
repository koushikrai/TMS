# TMS-365 Transport Management System — Antigravity Master Build Prompt

> **Project**: TMS-365 | Transport & Logistics Platform for Expertise Company CJSC  
> **Source Documents**: RFP (Expertise_Transport_Logistics_System_RFP_Final.pdf) + Fit-Gap Matrix (TMS-365__Transport_Management_System__003_.xlsx)  
> **Stack**: Antigravity · UIPro (`uipro init --ai antigravity`) · Apple Design (`npx getdesign@latest add apple`) · Framer Motion · Three.js · GSAP  

---

## 0. BEFORE YOU WRITE A SINGLE LINE OF CODE

Run the following to initialise the design system and animation libraries:

```bash
# 1. Initialise Antigravity with UIPro AI mode
uipro init --ai antigravity

# 2. Add Apple design tokens (getdesign)
npx getdesign@latest add apple

# 3. Install animation + 3D libraries
npm i framer-motion three gsap @gsap/react

# 4. (optional) GSAP ScrollTrigger + Draggable plugins
npm i gsap
```

Then read the `getdesign.md` apple spec in full before touching any component. Every colour, radius, shadow, spacing value, and typographic scale **must** come from the Apple design token sheet that `getdesign` provides. UIPro is the component engine — call it for every UI primitive (Button, Card, Badge, Table, Modal, Select, Toast, etc.). Use Framer Motion for all page transitions, panel reveals, list staggering, and micro-interactions. Reserve Three.js for the live 3D map globe on the Command Center dashboard. Use GSAP (with ScrollTrigger) for scroll-driven KPI counter animations, timeline progress bars, and any large hero entrance sequence.

---

## 1. PROJECT OVERVIEW & PHILOSOPHY

You are building **TMS-365**, a single, centralised, enterprise-grade Transport & Logistics platform for **Expertise Company – Closed Joint Stock Company (CJSC)** headquartered in Jubail, Saudi Arabia. The platform replaces all manual spreadsheet-based operations and acts as the operational execution layer while SAP S/4HANA remains the system of record.

The UI aesthetic target: **Apple-polished command centre**. Clean, high-information-density surfaces with controlled use of depth, motion, and color. Think Apple Maps × Vercel Analytics × Linear. Every pixel must feel considered. Use the Apple design token system religiously. No generic SaaS dashboard vibes — this is a mission-critical operations platform.

**Core design language:**
- Background: Apple `systemBackground` / `secondarySystemBackground` layering
- Accent: A rich KSA-inspired deep teal (`#006B6B`) as the primary brand accent alongside Apple system blue
- Danger/Alert: Apple system red
- Warning: Apple system orange
- Surface elevation follows Apple's material layering (base → elevated → overlay)
- Typography: SF Pro Display (headings) / SF Pro Text (body) via Apple's getdesign tokens
- Radius: `apple-radius-medium` (12 px) for cards, `apple-radius-large` (20 px) for sheets/modals
- Framer Motion: `spring(stiffness: 300, damping: 30)` as the default easing; use `AnimatePresence` for all mount/unmount transitions
- GSAP ScrollTrigger on the public landing/login page only
- Three.js: globe on Command Center, kept minimal and performant (max 60fps)

---

## 2. APPLICATION ARCHITECTURE

Build as a **Next.js 14 App Router** monorepo with the following top-level structure:

```
/app
  /(auth)          → Login, SSO redirect
  /(portal)        → Main authenticated shell
    /dashboard          → Command Center (default landing)
    /light-vehicles     → Light Vehicle Management
    /buses              → Bus Management / Employee Transport
    /heavy-vehicles     → Heavy Vehicle & Equipment
    /drivers            → Driver Management
    /violations         → Vehicle Violations & Compliance
    /vendors            → Vendor & RFQ Management
    /master-data        → MDM hub (locations, routes, compliance docs)
    /workflows          → Workflow Builder & Approval Framework
    /reports            → Reporting, KPIs & Analytics
    /settings           → System config, RBAC, integrations
/components
  /ui              → UIPro primitive overrides + Apple tokens applied
  /charts          → Recharts + custom Three.js components
  /maps            → GPS live map (Mapbox GL or Leaflet + Three.js globe)
  /animations      → Shared Framer Motion variants
  /gsap            → Shared GSAP contexts and ScrollTrigger configs
/lib
  /api             → API layer stubs (SAP CPI / REST endpoints)
  /store           → Zustand global state
  /hooks           → Custom hooks (useRealtime, useVehicleStatus, etc.)
  /types           → Full TypeScript types for every entity
```

**State management**: Zustand (lightweight, no Redux overhead)  
**Data fetching**: TanStack Query v5 (React Query) with optimistic updates  
**Forms**: React Hook Form + Zod validation  
**Tables**: TanStack Table v8 with virtualisation for high-row-count  
**Date/Time**: date-fns (KSA timezone support `Asia/Riyadh`)

---

## 3. AUTHENTICATION & RBAC

Implement role-based access with these **7 roles** drawn directly from the RFP:

| Role | Code | Access Level |
|------|------|-------------|
| Executive | `EXEC` | Read-only Management Dashboard + all reports |
| Transport Admin | `TRANS_ADMIN` | Full operational access across all modules |
| Fleet Manager | `FLEET_MGR` | Light Vehicle + Bus + Heavy Vehicle modules |
| Driver | `DRIVER` | Driver dashboard, trip log, document uploads only |
| HR / Department | `HR_DEPT` | Employee transport utilisation, eligibility management |
| Finance | `FINANCE` | Cross-charge reports, vendor invoicing, SAP financial reports |
| System Admin | `SYS_ADMIN` | Full system access, RBAC config, workflow builder, integrations |

Build a **Login page** with:
- Apple-style card centred on a dark teal gradient background
- Company logo placeholder + "TMS-365" wordmark
- Email + password fields using UIPro inputs with Apple styling
- Framer Motion: card slides up with spring on mount
- "Sign in with SSO" secondary button (placeholder)
- Role selector dropdown (for demo/dev mode only, hidden in production)

Post-login, detect role from JWT and route to the role-appropriate default view.

---

## 4. SHELL & NAVIGATION

### Global Shell
- **Left sidebar** (collapsible, 240 px → 64 px icon rail)
  - Framer Motion `layout` animation on collapse/expand
  - Apple `secondarySystemBackground` surface with `apple-radius-large` on expanded state
  - Logo / avatar at top; logout + settings at bottom
  - Active item: teal accent left border + `apple-systemFill` background

- **Top bar** (72 px)
  - Breadcrumb trail (animated with Framer Motion on route change)
  - Global search (Command-K palette, Framer Motion scale-in)
  - Notification bell with animated badge counter (Framer Motion keyframes pulse)
  - User avatar + role chip

- **Notification system**
  - Toast stack (bottom-right) using Framer Motion `AnimatePresence` stagger
  - Categorised: Info (blue), Warning (orange), Alert (red), Success (green)
  - Toast auto-dismisses after 5 s with GSAP countdown bar

---

## 5. MODULE BUILD SPECIFICATIONS

Build every module below in order. Each module section describes: screen layout, components, data model, key interactions, animations, and integration hooks.

---

### MODULE A — COMMAND CENTER DASHBOARD (`/dashboard`)

This is the **hero screen**. Every role lands here first (filtered by permission).

#### Layout (3-column grid on desktop, stacked on mobile):
```
[ Live Fleet Map — full width, 420px tall ]
[ KPI Strip: 6 cards across ]
[ Left: Alert Feed ]  [ Centre: Active Trips ]  [ Right: Compliance Status ]
[ Bottom: Fleet Utilisation Bar Chart ] [ Vendor Performance Ring ]
```

#### Three.js Globe (Live Fleet Map):
- Replace the flat map on initial load with a subtle 3D globe centred on Saudi Arabia
- `THREE.WebGLRenderer` with `antialias: true`, transparent background
- KSA landmass highlighted in teal; vehicle pins rendered as animated `THREE.Sprite` objects
- On click, camera lerps to the vehicle's lat/lng using GSAP `.to(camera.position)` with `ease: "power2.inOut"`
- After 2 s idle, smoothly transitions to a flat Mapbox 2D map view for operational detail
- GSAP `gsap.ticker` drives the globe rotation on the login/landing screen (ambient loop)

#### KPI Strip (6 cards, Framer Motion stagger on mount):
Built with UIPro `<Card>` + Apple tokens. GSAP `CountUp` animation when values enter viewport.

| KPI Card | Metric | Color |
|----------|--------|-------|
| Fleet Active | `activeVehicles / totalVehicles` % | Teal |
| Trips Today | count | Blue |
| Compliance Expiring (7d) | count | Orange |
| Violations Open | count | Red |
| Vendor SLA % | percentage | Green |
| Cost This Month | SAR amount | Purple |

#### Alert Feed (real-time, scrollable):
- UIPro `<List>` with Apple-style dividers
- Each item: severity icon (color-coded) · message · timestamp · "View" action chip
- New alerts animate in from the right with Framer Motion `x: 40 → 0, opacity: 0 → 1`
- Filter chips at top: All · Critical · Warning · Info

#### Active Trips Panel:
- Real-time trip cards showing: Vehicle plate · Driver name · Route · ETA · GPS status dot
- Status dot animates with Framer Motion `scale: [1, 1.3, 1]` pulse on "In Transit"
- Expandable row reveals mini route map (Mapbox static image)

#### Compliance Status Ring:
- SVG donut chart (D3 or Recharts `RadialBarChart`) broken into: ✅ Valid · ⚠ Expiring Soon · ❌ Expired
- Framer Motion `pathLength` animation on first render

---

### MODULE B — LIGHT VEHICLE MANAGEMENT (`/light-vehicles`)

**RFP Ref: Section 3.4.1 | Fit-Gap: LV-01 through LV-14**

#### Sub-pages:
1. `/light-vehicles` — Fleet Overview
2. `/light-vehicles/requests` — Vehicle Request Hub
3. `/light-vehicles/allocations` — Allocation Management
4. `/light-vehicles/fleet` — Vehicle Master List
5. `/light-vehicles/[vehicleId]` — Individual Vehicle Profile

#### Fleet Overview:
- **Filter bar**: Vehicle type (SUV / Sedan / Small SUV) · Ownership (Owned / Leased) · Status · Department
- **View toggle**: Card grid ↔ Data table (Framer Motion `layout` transition)
- **Vehicle Card** (UIPro `<Card>` with Apple tokens):
  - Vehicle image placeholder · Plate number · Model · Status badge (color-coded)
  - Owner type chip: `🏢 Owned` or `🤝 Vendor` 
  - Utilisation mini bar · Next maintenance date
  - Quick actions: View · Allocate · Report Breakdown
  - Framer Motion hover: `scale: 1.02, y: -4` with spring

#### Vehicle Request Hub:
Three request type tabs with Framer Motion tab indicator sliding between them:

**Tab 1 — Permanent Allocation:**
- Form: Employee lookup (SAP-linked) · Grade auto-populated (M1/M2/M3) · Justification · Approval chain preview
- Grade → vehicle type eligibility auto-resolved: M1 → SUV, M2 → Sedan/Small SUV, M3 → Small SUV
- Submit triggers Framer Motion success sheet slide-up

**Tab 2 — Temporary Allocation:**
- Date range picker · Purpose · Pickup location (geo-search) · Drop location

**Tab 3 — One-time / Trip-based:**
- Single trip form: From → To · Date/Time · Passenger count · Purpose code

All request forms use React Hook Form + Zod. On submit, the approval workflow chain renders inline with animated connector lines (Framer Motion `pathLength` draw-on).

#### Intelligent Allocation Engine (LV-06, LV-09):
- "Smart Suggest" button triggers an animated loading state (GSAP spinner, Apple `systemFill`)
- Returns ranked vehicle suggestions: score card per vehicle (availability · location proximity · utilisation history · owned-first preference)
- Framer Motion list stagger reveals suggestions one by one

#### Vehicle Master List (TanStack Table):
Columns: ID · Plate · Make/Model · Category · Model Level · Ownership · Dept · Status · Utilisation % · Last Service · Compliance Status · Actions

- **Row expand**: shows maintenance history timeline (GSAP timeline horizontal scroll)
- **Inline edit** for status changes
- **Bulk actions**: Export · Update Status · Schedule Maintenance

#### Vehicle Profile Page (`/light-vehicles/[vehicleId]`):
Full-page layout with three sections:

**Left (1/3):**
- Vehicle photo / silhouette illustration
- Status badge · Ownership type
- Plate number, Make/Model/Year, Body type, Colour
- Grade eligibility (M1/M2/M3 chips)
- GPS location mini-map with live dot

**Centre (1/2):**
Tab panel (Framer Motion animated tab content):
- **Overview**: Current allocation, cost center, department
- **Maintenance History**: Timeline component (GSAP horizontal scroll, milestone dots)
- **Documents**: Insurance · Istimara · Ownership transfer records (expiry countdown badges)
- **Trip History**: Table of recent trips with driver, route, cost
- **Violations**: Any linked violations

**Right (1/6):**
- Quick actions sidebar (UIPro `<Button>` variants)
- Compliance summary (expiry dates with traffic-light status)
- Cost this month (SAR)
- Chain of ownership log (LV-13 — scrollable timeline)

---

### MODULE C — BUS MANAGEMENT / EMPLOYEE TRANSPORTATION (`/buses`)

**RFP Ref: Section 3.4.2 | Fit-Gap: BM-01 through BM-09**

#### Sub-pages:
1. `/buses` — Operations Overview
2. `/buses/routes` — Route Planning & Management
3. `/buses/trips` — Daily Trip Scheduler
4. `/buses/fleet` — Bus Master Data
5. `/buses/capacity` — Capacity Planner

#### Operations Overview:
- **Live route map** (Mapbox): Active bus routes rendered as animated polylines (GSAP `stroke-dashoffset` animation for "moving bus" effect)
- **Occupancy heatmap** by route: coloured route lines (green = >80% · amber = 50-80% · red = <50%)
- **Today's stats strip**: Total trips · Total employees transported · Empty seat ratio · On-time % · Breakdowns

#### Route Planning (`/buses/routes`):
- Route list (UIPro `<Table>`) with: Route ID · Origin → Destination · Stops · Distance · Estimated time · Compliance flag
- **Route Builder**: Interactive map with drag-to-place pickup/drop points; waypoints reorderable via DnD (Framer Motion `Reorder.Group`)
- Route Optimisation panel: runs consolidation analysis, shows recommendations for low-occupancy merges with before/after occupancy visualisation

#### Daily Trip Scheduler (`/buses/trips`):
- Calendar-based view (week/day toggle) with Framer Motion page transition
- **Shift-based planning grid**: Each shift block shows bus assigned, driver, occupancy, status
- SAP Roster integration banner: "Synced with SAP Roster — 12 employees on leave today (auto-excluded)"
- Drag-to-assign bus to shift slot (Framer Motion drag with snap-to-grid)
- Auto-exclusion badge on employee cards when on leave

#### Bus Master Data:
TanStack Table with expandable rows. Each bus:
- Bus ID (linked SAP Equipment No.) · Make/Model · Seating Capacity · Plate · Ownership · GPS ID · Vendor · Status
- Expand: Current route assignment · Driver · Last service · Document expiry status

#### Capacity Planner (`/buses/capacity`):
- **Forecasted vs Actual** dual-line chart (Recharts `ComposedChart`)
- **What-if simulator**: Sliders for peak occupancy %, merge threshold → real-time chart update
- Recommendations cards (Framer Motion stagger): "Merge Route 4A + 4B — saves 1 bus, 14% cost reduction"
- GSAP counter animation on savings figures

---

### MODULE D — HEAVY VEHICLE & EQUIPMENT MANAGEMENT (`/heavy-vehicles`)

**RFP Ref: Section 3.4.3 | Fit-Gap: HV-01 through HV-14**

#### Sub-pages:
1. `/heavy-vehicles` — Operations Hub
2. `/heavy-vehicles/requests` — Movement Request Center
3. `/heavy-vehicles/fleet` — Equipment Master
4. `/heavy-vehicles/permits` — KSA Permit Management (MIZAN, TAMM, MVPI, Tasriya, Naql)
5. `/heavy-vehicles/rfq` — Vendor RFQ & Assignment
6. `/heavy-vehicles/tracking` — Live Trip Monitoring

#### Operations Hub:
- **Daily requests counter** (large GSAP CountUp): 35–40+ requests/day displayed prominently
- **Availability board**: Kanban-style columns (Available · Assigned · In Transit · Under Maintenance · Under Permit Review)
- Framer Motion drag between columns for status update
- Each equipment card: Category icon (truck/trailer/low-bed/crane) · Plate · Load capacity · Current location · Permit status

#### Movement Request Center (`/heavy-vehicles/requests`):
Multi-step form with Framer Motion step progress indicator:

**Step 1 — Request Details:**
- Auto-populate from requestor SAP profile (department, cost center, project/WBS)
- Load description · Weight · Dimensions (L × W × H)
- Pickup location (map pin) · Delivery location (map pin)
- Scheduled date/time · Priority (Normal / Urgent)

**Step 2 — Permit Requirements:**
System automatically evaluates permit requirements based on load dimensions/weight:
- MIZAN (weight permits) · TAMM · MVPI · Tasriya · Naql
- Red/green status per permit type
- "Validate Permits" button → animated check sequence (Framer Motion `staggerChildren` on checkmark icons)
- Block dispatch if any permit is invalid/expired

**Step 3 — Vehicle Recommendation:**
- Intelligent suggestion engine returns ranked vehicles
- Each suggestion: Equipment ID · Category · Load capacity · Current location · Compliance readiness · Availability score
- Visualised as score bars (Framer Motion `width` animation)
- "Select & Assign" button on chosen vehicle

**Step 4 — Approval Routing:**
- Approval chain visualised as connected nodes (SVG path + Framer Motion `pathLength`)
- Current approver highlighted with animated ring

#### KSA Permit Management:
Table of all active permits per vehicle:

| Vehicle | MIZAN | TAMM | MVPI | Tasriya | Naql | Valid Routes | Expiry |
|---------|-------|------|------|---------|------|-------------|--------|

- Traffic-light status per permit type
- "Permit expiring in 3 days" banner (orange, dismissable) using Framer Motion slide-down
- One-click permit renewal request form

#### Vendor RFQ (`/heavy-vehicles/rfq`):
- **Create RFQ**: Select vendors from master list · Describe load/route requirements · Set bid deadline
- **Bid Comparison Matrix**: Side-by-side table with: Vendor · Rate (SAR) · ETA · Compliance score · Historical SLA · Recommended flag
- Recommended vendor highlighted with teal border + "Best Value" badge
- Approval workflow triggers on vendor selection

#### Live Trip Monitoring:
- Mapbox GL full-screen map with active heavy vehicle positions
- Trip timeline sidebar: Departure confirmed · En Route · Checkpoint 1 · Checkpoint 2 · Delivered
- Real-time ETA countdown per trip
- Geo-fence breach alerts appear as red flash overlay on map (Framer Motion `animate: { opacity: [1, 0, 1] }`)
- Proof of delivery upload modal (driver photo + digital signature)

---

### MODULE E — DRIVER MANAGEMENT (`/drivers`)

**RFP Ref: Section 3.4.4 | Fit-Gap: DM-01 through DM-08**

#### Sub-pages:
1. `/drivers` — Driver Directory
2. `/drivers/[driverId]` — Driver Profile
3. `/drivers/performance` — Performance Analytics
4. `/drivers/availability` — Availability & Scheduling

#### Driver Directory:
- Search + filter: Owned vs Vendor · License category · Active/Inactive · Document status
- UIPro `<Card>` grid (Framer Motion stagger):
  - Driver photo circle · Name · ID · License category · Current assignment
  - Document status indicator row: License · Iqama · Insurance (green/orange/red per expiry proximity)
  - Utilisation donut (small Recharts `PieChart`)

#### Driver Profile Page:
Left sidebar:
- Photo · Name · Employee ID (SAP) · Driver type (Owned / Vendor) · Contact

Tab panel:
- **Documents**: License (with expiry countdown timer — GSAP `gsap.to(counter)` on mount), Iqama, Insurance — each with upload button
- **Assigned Vehicles**: Current + historical (timeline component)
- **Trip Log**: Table with date · route · vehicle · duration · distance · status
- **Performance Scorecard**: Safety violations · On-time rate · Trip completion rate · Incident count — rendered as Apple-style metric tiles
- **Communication Log**: In-app message thread with driver

Document expiry countdown: `DD days remaining` in orange when <30 days, red when <7 days, GSAP pulse animation on critical expiry.

#### Performance Analytics:
- **Leaderboard** (top 10 drivers): Framer Motion animated rank changes
- **KPI Charts** (Recharts):
  - Trip completion rate (bar chart, last 30 days)
  - On-time pickup/drop % (line chart with trend)
  - Safety violations by driver (horizontal bar)
  - Route deviation count heatmap (calendar view)
- **Speed & Safety** from GPS: plotted over time
- Driver scorecards exportable to PDF

---

### MODULE F — VEHICLE VIOLATIONS & COMPLIANCE (`/violations`)

**RFP Ref: Section 3.4.5 | Fit-Gap: VC-01 through VC-04**

#### Sub-pages:
1. `/violations` — Violations Dashboard
2. `/violations/new` — Log Violation
3. `/violations/[violationId]` — Violation Detail & Lifecycle

#### Violations Dashboard:
- **Summary tiles** (Framer Motion stagger): Total Open · Under Review · Disputed · Resolved This Month
- **Violation type breakdown** (Recharts `RadarChart`): Speeding · Route Deviation · Geo-fence · Document Non-compliance
- **Source breakdown**: GPS · Manual Entry · Government Portal
- **Violations table** (TanStack Table):
  - Columns: ID · Vehicle · Driver · Violation Type · Source · Date · Status · Financial Impact (SAR) · Actions
  - Status badge colour-coded: `Reported` (blue) · `Under Review` (yellow) · `Disputed` (orange) · `Resolved` (green) · `Closed` (grey)
  - Row click → slide-in side panel with full violation detail (Framer Motion `x: 100% → 0`)

#### Log Violation (`/violations/new`):
- Source selector: GPS-triggered (auto-fill from GPS event) · Manual Entry · Government Portal Reference
- Vehicle lookup · Driver linked automatically from assignment
- Violation type multiselect (Speeding / Route Deviation / Geo-fence breach / Document non-compliance)
- Evidence upload (GPS screenshot / photo / government notice)
- Financial linkage: estimated cost · department/cost center · vendor penalty (if applicable)
- Submit → Violation auto-assigned to reviewer per RBAC workflow

#### Violation Lifecycle (`/violations/[violationId]`):
- **Status stepper** at top: Reported → Under Review → Disputed → Resolved/Closed
  - Framer Motion `pathLength` animation connecting steps
  - Active step pulses with teal ring
- **Timeline feed** of all actions: who did what, when
- **Financial Impact** section: cost allocation to department / vendor penalty tracker
- **Driver Record Impact**: link to driver profile, flag on performance record
- **Dispute Form**: if status = Under Review, driver/vendor can raise dispute with supporting evidence

---

### MODULE G — VENDOR & RFQ MANAGEMENT (`/vendors`)

**RFP Ref: Sections 3.5.4, 3.8.4-D | Fit-Gap: VR-01 through VR-04**

#### Sub-pages:
1. `/vendors` — Vendor Directory
2. `/vendors/[vendorId]` — Vendor Profile
3. `/vendors/rfq` — RFQ Management
4. `/vendors/rate-cards` — Rate Card Master

#### Vendor Directory:
- Vendor cards: SAP Vendor ID · Company name · Contract validity badge · Vehicle count · SLA compliance %
- Filter: Active contracts only · Vehicle type provided · SLA status
- Performance badge: Gold (>95% SLA) · Silver (85–95%) · Review (<85%)

#### Vendor Profile:
- Contract details · Rate cards active · Vehicle list (owned by this vendor in our fleet)
- Performance history: SLA trend chart (Recharts `AreaChart`)
- Invoice history table with accuracy rate
- RFQ participation history

#### RFQ Management:
- **RFQ List**: Active · Closed · Awarded
- **Create RFQ** (button → Framer Motion modal sheet):
  - Load/movement requirements · Select eligible vendors (multiselect) · Bid deadline · Evaluation criteria weights
- **Bid Comparison**: Side-by-side comparison table with weighted score calculation visible
- Vendor selection workflow with approval chain

#### Rate Card Master:
- Searchable table: Vendor · Trip type · Base rate (SAR) · KM rate (SAR) · Validity from/to · Vehicle category
- "Previously quoted for similar trip" smart lookup when creating a new RFQ
- Edit inline with React Hook Form

---

### MODULE H — MASTER DATA MANAGEMENT (`/master-data`)

**RFP Ref: Section 3.8 | Fit-Gap: MDM-01 through MDM-08**

Four sub-sections accessible via tab navigation:

#### Tab 1 — Locations & Geo (`MDM-01`):
- CRUD for: Sites / Project Locations · Depots / Yards · Pickup & Drop Points · Restricted Zones
- Each location: Name · Type · GPS coordinates · Geo-fence radius (polygon editor on Mapbox map)
- Geo-fence polygon draw tool using Mapbox Draw plugin
- "Test Geo-fence" button → simulates a vehicle path through the fence with animated dot

#### Tab 2 — Route Master (`MDM-02`):
- Route list with: Route ID · Origin → Destination · Stops count · Distance · Est. time · Compliance flag
- Route Map Preview (static Mapbox image) in expandable row
- New Route wizard with map-based waypoint selection

#### Tab 3 — Compliance & Document Master (`MDM-03`):
- Document types registry: name · issuing authority · regulatory category (KSA) · alert threshold (days)
- Global expiry alert rules: "Alert when <30 days, Critical when <7 days"
- Document type: Registration · Insurance · Permit · License · MIZAN · TAMM · MVPI · Tasriya · Naql · Istimara · Iqama

#### Tab 4 — Data Quality Controls (`MDM-08`):
- Duplicate prevention rules (configurable field-level uniqueness checks)
- Reconciliation status: last SAP sync timestamp per entity type
- Error log: failed imports / mismatched records with "Fix" action buttons
- Mandatory field validation rule editor

---

### MODULE I — WORKFLOW BUILDER & APPROVAL FRAMEWORK (`/workflows`)

**RFP Ref: Section 3.9 | Fit-Gap: WF-01 through WF-09**

This is the most complex module. Build a **no-code visual workflow designer**.

#### Workflow List:
- All configured workflows with: Name · Module · Status (Active/Draft) · Last modified · Triggered count
- UIPro `<Badge>` colour-coded by module
- Duplicate · Edit · Activate/Deactivate actions

#### Workflow Builder Canvas:
Use React Flow (or a custom canvas with Framer Motion drag-and-drop):

**Node types** (design as Apple-style pills/cards):
- 🟢 **Start** — trigger event (e.g., "Vehicle Request Submitted")
- 🔵 **Approver** — person/role selector, optional SLA timer
- 🟡 **Condition** — branching: `IF vehicle.ownership == "Vendor" THEN ...`
- 🔴 **Escalation** — SLA breach action
- 🟣 **Notification** — multi-channel: in-app · email · SMS
- ⚫ **End** — final status (Approved / Rejected / Auto-approved)

**Canvas interactions:**
- Drag nodes from sidebar panel onto canvas (Framer Motion drag)
- Connect nodes by drawing edges (click source port → drag to target port)
- Click any node to open Apple-style inspector panel (slides in from right)
- Framer Motion `layout` on all canvas repositioning

**Condition builder** (for Condition nodes):
- Visual if/else builder: field selector · operator · value
- Available fields auto-populated based on module context
- Support: `vehicle.ownership` · `request.grade` · `cost.threshold` · `route.distance` · `trip.type` · `employee.grade`

**Workflow Coverage** (pre-built templates available — all from RFP section 3.9.2):
- Bus allocation approval
- Light vehicle request (permanent / temporary / trip)
- Heavy vehicle movement request
- Emergency vs planned handling override
- Vehicle onboarding / decommission / ownership change
- Driver assignment & eligibility validation
- License expiry exception
- RFQ approval → vendor selection → rate card approval
- Grade eligibility override
- Out-of-policy approval
- Geo-fence violation review
- Route deviation approval

**Version control**: Each save creates a version. Version history drawer with `diff` view comparing previous vs current workflow.

**SAP Integration**: Approver nodes can "Derive from SAP Org" toggle → pulls approver hierarchy from SAP HCM.

---

### MODULE J — REPORTING, DASHBOARDS & ANALYTICS (`/reports`)

**RFP Ref: Section 3.7 | Fit-Gap: RA-01 through RA-11**

#### Sub-pages:
1. `/reports` — Report Hub
2. `/reports/kpis` — KPI Configuration & Monitoring
3. `/reports/capacity` — Capacity Planner (shared with Bus module)
4. `/reports/predictive` — Predictive & Trend Analytics
5. `/reports/scheduled` — Scheduled Report Manager

#### Report Hub:
- **Report library**: Pre-built SAP-aligned reports + custom reports
- Template categories:
  - **Fleet**: Utilisation · Idle time · Maintenance cost · Compliance expiry
  - **Financial**: Cost center logistics cost · Project/WBS transport cost · Vendor invoice reconciliation · Budget vs actual
  - **Driver**: Performance scorecard · Safety violations · Compliance
  - **Vendor**: SLA compliance · Cost variance · Invoice accuracy
  - **Executive**: Fleet overview · KPI summary · Compliance posture

Each report: click → Framer Motion full-page expand → rendered chart + table with drill-down capability.

**Export**: Excel / PDF (per RFP 3.7.6). Schedule via cron (daily/weekly/monthly) with recipient email list.

#### KPI Configuration (`/reports/kpis`):
Interactive KPI studio:

**Vehicle Performance KPIs** (per 3.7.2.1):
- Fleet utilisation % · Idle vs active time · Cost per km · Cost per trip · Maintenance cost per vehicle · Breakdown frequency · Compliance expiry adherence · On-time arrival %

**Driver Performance KPIs** (per 3.7.2.2):
- Trip completion rate · On-time pickup/drop % · Route deviation count · Speed/safety violations · Employee feedback score · License validity · Incident/accident frequency

**Route & Transport Efficiency KPIs** (per 3.7.2.3):
- Route occupancy % · Empty seat ratio · Route cost efficiency · Average travel time variance · Geo-fence breach count · Fuel consumption trend

**Vendor Performance KPIs** (per 3.7.2.4):
- Vendor vehicle utilisation · SLA compliance % · Cost variance vs contract · Service rejection rate · Compliance adherence · Invoice accuracy

Each KPI: editable name · target value · alert threshold · chart type · Power BI export toggle.

**Power BI Connector**: Toggle switch to expose KPI via OData REST endpoint (placeholder with API key display).

#### Predictive & Trend Analytics (`/reports/predictive`):
Using Recharts `ComposedChart` (bar + line overlays):
- Maintenance cost trend (monthly, 12-month rolling) + anomaly highlight
- Vehicle replacement recommendation engine: shows vehicles approaching cost-of-keep threshold
- Demand forecasting: historical trips vs project timeline overlay
- Seasonal demand heatmap (calendar with intensity colour)

GSAP ScrollTrigger: all charts animate in as user scrolls down the page (counter up, bars grow, lines draw).

#### What-if Simulation (per 3.7.3):
- Scenario slider panel: adjust fleet size · peak occupancy % · merge threshold
- Real-time Recharts update on slider change (debounced 200ms)
- Output: projected cost savings · vehicles saved · fuel reduction
- GSAP CountUp on savings figures

---

### MODULE K — SETTINGS & SYSTEM CONFIGURATION (`/settings`)

Tab-based settings panel (Framer Motion animated tab content):

**Tab 1 — User & Role Management:**
- User list (TanStack Table): Name · Email · Role · Status · Last active
- Invite user form (modal) · Role assignment · Deactivate/Activate
- RBAC matrix visualiser: rows = roles, columns = modules, cells = permission level (None/Read/Write/Admin)

**Tab 2 — Integrations:**
Status cards for all integration endpoints:
- SAP S/4HANA (Employee Master · Roster · Vehicle PM · Vendor MM · PS/CO Financial) — `🟢 Connected` / `🔴 Error` / `⚪ Not Configured`
- Saudi Ex GPS — connection test button with animated spinner
- ZKT Biotime Attendance — API endpoint config
- Petro APP Fuel — API key input
- KSA TGA / Naql / MIZAN — regulatory data alignment config
- SAP Fiori Inbox — notification routing
- SMS Gateway — provider config (Twilio/STC placeholder)

Each integration card: status indicator (Framer Motion color-animated pulse dot) · last sync timestamp · "Test Connection" button · configure/edit action.

**Tab 3 — Notification Templates:**
- Edit email/SMS/in-app templates per notification event
- Variables palette (drag-and-drop into template): `{{vehicle.plate}}`, `{{driver.name}}`, `{{expiry.date}}`, etc.
- Preview pane with live render

**Tab 4 — Document Expiry Rules:**
- Global rules: alert lead time per document type
- Per-module overrides

**Tab 5 — System Audit Log:**
- Full immutable log of all system actions (TanStack Table, virtualised)
- Filters: user · module · action type · date range
- Export to Excel/PDF

---

## 6. GLOBAL COMPONENT LIBRARY (UIPro + Apple Tokens Applied)

Build these shared components once and use everywhere:

### Data Display:
- `<MetricTile>` — KPI card with GSAP CountUp, delta badge, mini sparkline
- `<StatusBadge variant="active|pending|critical|resolved">` — Apple-style coloured chip
- `<ComplianceCountdown days={n}>` — colour-shifts green → amber → red as expiry approaches; GSAP pulse when critical
- `<VehicleCard>` — reusable card for fleet list views
- `<DriverCard>` — reusable card for driver directory
- `<TripCard>` — active trip summary card

### Navigation:
- `<CommandPalette>` — ⌘K search modal (Framer Motion scale + blur backdrop)
- `<Breadcrumb>` — animated on route change
- `<TabNav>` — sliding indicator tab navigation (Framer Motion `layoutId`)

### Forms:
- `<VehicleRequestForm>` — multi-step with Framer Motion step transitions
- `<WorkflowNodeInspector>` — side panel for workflow builder
- `<GeoFenceEditor>` — Mapbox Draw wrapper

### Feedback:
- `<ToastStack>` — Framer Motion AnimatePresence stacked toasts
- `<AlertBanner>` — dismissable banner (slide-down with Framer Motion)
- `<LoadingSkeleton>` — Apple-style shimmer (CSS animation)
- `<ConfirmSheet>` — iOS-style bottom sheet confirmation (Framer Motion y: 100% → 0)
- `<EmptyState illustration={...}>` — contextual empty states with action buttons

### Charts (Recharts-based, themed to Apple design tokens):
- `<UtilisationDonut size="sm|md|lg">`
- `<TrendLine period="7d|30d|90d">`
- `<OccupancyBar>`
- `<ComplianceRing>`
- `<VendorRadar>`
- `<KPIAreaChart>`

---

## 7. ANIMATION SYSTEM

### Framer Motion Variants (define in `/components/animations/variants.ts`):

```typescript
export const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 30 } },
  exit: { opacity: 0, y: -10, transition: { duration: 0.15 } }
}

export const cardStagger = {
  animate: { transition: { staggerChildren: 0.06 } }
}

export const cardItem = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 400, damping: 28 } }
}

export const slideInRight = {
  initial: { x: '100%', opacity: 0 },
  animate: { x: 0, opacity: 1, transition: { type: 'spring', stiffness: 350, damping: 35 } },
  exit: { x: '100%', opacity: 0, transition: { duration: 0.2 } }
}

export const scaleIn = {
  initial: { scale: 0.92, opacity: 0 },
  animate: { scale: 1, opacity: 1, transition: { type: 'spring', stiffness: 400, damping: 30 } }
}
```

### GSAP Usage Rules:
- **CountUp**: All KPI numbers animate from 0 → value on mount (use `gsap.to(counter, { textContent: value, duration: 1.2, ease: 'power2.out', snap: { textContent: 1 } })`)
- **ScrollTrigger**: Activate only on `/` (login/landing) page hero and `/reports` page chart reveals
- **Globe rotation**: `gsap.ticker.add()` in the Three.js globe component; clean up on unmount
- **Timeline bars** in maintenance/trip history: `gsap.fromTo(bar, { scaleX: 0 }, { scaleX: 1, duration: 0.6, ease: 'power2.out', transformOrigin: 'left center' })`

### Three.js Globe Rules:
- Load in a `<Suspense>` boundary with shimmer fallback
- Use `drei` helpers if using `@react-three/fiber`; otherwise raw Three.js in a `useEffect` with proper cleanup
- Keep draw calls minimal: no more than 200 vehicle markers on screen
- `requestAnimationFrame` loop managed by Three.js renderer; never conflict with GSAP ticker

---

## 8. SAP INTEGRATION LAYER (API STUBS)

Create `/lib/api/sap/` with typed stubs for all integration points. These are the hooks that the real SAP CPI middleware will eventually replace:

```
/lib/api/sap/
  employee.ts      → getEmployeeMaster(employeeId)
  roster.ts        → getRosterByDate(date), getLeavesToday()
  vehicle.ts       → getEquipmentMaster(equipmentId), getMaintenanceStatus(equipmentId)
  vendor.ts        → getVendorMaster(vendorId), getVendorVehicles(vendorId)
  finance.ts       → postCrossCharge(costCenter, amount, description)
  project.ts       → getWBSCodes(), postProjectCost(wbs, amount)
  notifications.ts → triggerFioriNotification(userId, message)
/lib/api/
  gps.ts           → getVehicleLocations(), subscribeToGPSFeed(vehicleId)
  fuel.ts          → getFuelUsage(vehicleId, dateRange)
  attendance.ts    → getAttendanceStatus(employeeId)
  regulatory.ts    → validatePermit(equipmentId, permitType), getPermitStatus(permitId)
```

Each stub returns realistic mock data with a 300–800ms artificial delay (using `setTimeout`) to simulate real network latency. Add a global `DEV_USE_MOCK` env flag — when true, all stubs return mock data; when false, they hit the real endpoint.

---

## 9. DATA MODELS (TypeScript — Core Entities)

Define exhaustive TypeScript interfaces in `/lib/types/`:

```typescript
// Vehicle (covers all categories)
interface Vehicle {
  id: string
  sapEquipmentNo: string
  category: 'SUV' | 'Sedan' | 'SmallSUV' | 'Bus' | 'Truck' | 'Trailer' | 'LowBed' | 'Crane' | 'HeavyEquipment'
  ownership: 'Owned' | 'Vendor'
  vendorId?: string
  plateNumber: string
  make: string
  model: string
  year: number
  modelLevel?: 'M1' | 'M2' | 'M3'
  status: 'Active' | 'UnderMaintenance' | 'Breakdown' | 'Decommissioned' | 'Available'
  gpsDeviceId?: string
  currentLocation?: { lat: number; lng: number; lastUpdated: Date }
  department?: string
  costCenter?: string
  maintenanceHistory: MaintenanceRecord[]
  documents: VehicleDocument[]
  allocations: Allocation[]
}

// Driver
interface Driver {
  id: string
  sapEmployeeNo: string
  name: string
  type: 'Owned' | 'Vendor'
  licenseNumber: string
  licenseCategory: string
  licenseExpiry: Date
  iqamaNumber: string
  iqamaExpiry: Date
  insuranceExpiry: Date
  currentAssignment?: { vehicleId: string; routeId?: string }
  performanceScore: number
  status: 'Active' | 'OnLeave' | 'Inactive'
}

// TransportRequest
interface TransportRequest {
  id: string
  type: 'LightVehicle_Permanent' | 'LightVehicle_Temporary' | 'LightVehicle_Trip' | 'Bus' | 'HeavyVehicle'
  requestorId: string  // SAP Employee ID
  department: string
  costCenter: string
  projectWBS?: string
  pickupLocation: Location
  dropLocation?: Location
  scheduledDate: Date
  purpose: string
  status: 'Draft' | 'Submitted' | 'UnderApproval' | 'Approved' | 'Rejected' | 'Assigned' | 'InProgress' | 'Completed'
  assignedVehicleId?: string
  assignedDriverId?: string
  approvalChain: ApprovalStep[]
  estimatedCost?: number
  actualCost?: number
}

// Violation
interface Violation {
  id: string
  vehicleId: string
  driverId?: string
  type: 'Speeding' | 'RouteDeviation' | 'GeofenceBreach' | 'DocumentNonCompliance'
  source: 'GPS' | 'Manual' | 'GovernmentPortal'
  capturedAt: Date
  status: 'Reported' | 'UnderReview' | 'Disputed' | 'Resolved' | 'Closed'
  description: string
  evidence: string[]  // URLs
  financialImpact?: number
  costCenter?: string
  vendorPenalty?: number
  driverRecordImpact: boolean
  lifecycle: ViolationEvent[]
}

// And similarly: Route, GeoFence, Vendor, RFQ, Bid, RateCard, MaintenanceRecord, VehicleDocument, WorkflowDefinition, WorkflowInstance, Permit, KSACompliance
```

---

## 10. BUILD ORDER (STEP-BY-STEP SEQUENCE)

Follow this exact sequence. Do not skip ahead. Commit after each step.

```
Step 01 — Project scaffold (Next.js 14 App Router, TS strict, Tailwind, ESLint, Prettier)
Step 02 — Run: uipro init --ai antigravity  |  npx getdesign@latest add apple  |  npm i framer-motion three gsap
Step 03 — Design token layer: map Apple getdesign tokens into Tailwind config + CSS variables
Step 04 — Global type definitions (/lib/types/)
Step 05 — API stubs (/lib/api/ — all SAP + GPS + fuel integrations with mock data)
Step 06 — Zustand store setup (/lib/store/)
Step 07 — Auth system (login page, JWT, RBAC guards, role-based routing)
Step 08 — Shell layout (sidebar, topbar, notification system, command palette)
Step 09 — Shared animation variants (/components/animations/)
Step 10 — Shared component library (MetricTile, StatusBadge, ComplianceCountdown, ToastStack, etc.)
Step 11 — Command Center Dashboard (globe, KPI strip, alert feed, active trips, compliance ring)
Step 12 — Master Data Management module (Locations, Routes, Document Master, Data Quality)
Step 13 — Light Vehicle Management (fleet overview, request hub, allocation, vehicle profile)
Step 14 — Bus Management (operations overview, route planning, trip scheduler, capacity planner)
Step 15 — Heavy Vehicle & Equipment (operations hub, movement requests, permits, RFQ, tracking)
Step 16 — Driver Management (directory, profiles, performance analytics, scheduling)
Step 17 — Violations & Compliance (dashboard, log form, lifecycle management)
Step 18 — Vendor & RFQ Management (directory, profiles, RFQ flow, rate cards)
Step 19 — Workflow Builder (canvas, node types, condition builder, version control)
Step 20 — Reporting & Analytics (report hub, KPI studio, predictive analytics, what-if simulation)
Step 21 — Settings (RBAC, integrations, notification templates, document rules, audit log)
Step 22 — Three.js globe polish + GSAP scroll animations on landing/reports
Step 23 — Mobile responsiveness pass (all modules responsive, sidebar collapses to bottom nav on mobile)
Step 24 — Accessibility pass (keyboard navigation, ARIA labels, reduced motion respect)
Step 25 — Performance audit (Lighthouse >90, Three.js canvas lazy-loaded, TanStack virtualisation verified)
```

---

## 11. QUALITY GATES (ENFORCE BEFORE EACH COMMIT)

- [ ] All UIPro primitives use Apple design tokens — no hardcoded colour hex values in component JSX
- [ ] Every page wrapped in Framer Motion `<AnimatePresence>` with `pageVariants`
- [ ] No Three.js `requestAnimationFrame` loops left without cleanup on component unmount
- [ ] GSAP ScrollTrigger instances killed in `useEffect` cleanup
- [ ] All forms have Zod validation — no unvalidated submit paths
- [ ] All tables have loading, empty state, and error state
- [ ] RBAC guards on every route — unauthenticated or unauthorised redirect
- [ ] TypeScript strict mode — no `any` types
- [ ] All timestamps displayed in `Asia/Riyadh` timezone
- [ ] All monetary values displayed in SAR with proper formatting
- [ ] Arabic-aware layout (RTL-ready CSS using logical properties: `margin-inline-start` not `margin-left`)

---

## 12. SAMPLE DATA SEED

When running in DEV mode, seed the application with realistic Saudi Arabia data:

- 40 light vehicles (16 owned, 24 vendor-leased) across SUV/Sedan/Small SUV
- 15 buses (6 owned, 9 vendor) with 20+ routes across Jubail Industrial Area
- 35 heavy vehicles/equipment (trucks, trailers, low-beds, cranes)
- 60 drivers (owned + vendor)
- 120 active transport requests across all categories
- 8 active vendors with rate cards and SLA history
- 45 compliance documents with mix of valid/expiring/expired statuses
- 12 open violations in various lifecycle stages
- 6 active workflows configured in the workflow builder
- 30 days of trip history with GPS track data (static JSON)

Seed all data in `/lib/seed/` and auto-load on `npm run dev` if `SEED_ON_START=true`.

---

## 13. FINAL NOTES FOR ANTIGRAVITY

- Treat the **Fit-Gap Analysis Matrix** (Excel file) as your feature specification. Every row with a `✅ Fully Available` or `⚠ Partially Available` status must be built. Rows marked `❌ Not Available` are integration endpoints — build the UI with a clear "Integration Pending" placeholder state rather than omitting the screen.
- The **RFP PDF** is your business requirements bible. Every functional requirement in Section 3 maps to a screen. Every KPI in Section 3.7.2 maps to a chart or metric tile.
- **Never use generic SaaS colours or layouts.** Every visual decision must be traceable to either the Apple design token spec or a deliberate adaptation of it.
- **The Workflow Builder is the crown jewel of the platform.** Spend proportionally more effort making it feel magical — smooth canvas interactions, satisfying node snapping, beautiful condition builder.
- The **Command Center globe** is the first impression. Make it stunning but fast. If it drops below 50fps on a mid-range MacBook, simplify the geometry.
- The platform is bilingual-aware (English primary, Arabic secondary). Use `dir="ltr"` globally but ensure all text containers support RTL switching without layout breaks.

Build it like it's going to run a real industrial logistics operation for 5,000 employees across the Kingdom of Saudi Arabia. Because it is.
