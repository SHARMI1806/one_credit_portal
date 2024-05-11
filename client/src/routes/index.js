import { lazy } from "react";

// use lazy for better code splitting, a.k.a. load faster
const Dashboard = lazy(() => import("../pages/Dashboard"));
const Assignedcourse = lazy(() => import("../pages/assignedcourse"));
const MyCourse = lazy(()=>import("../pages/myCourses")); 
const StudentMaster = lazy(() => import("../pages/Tables"));
const creditsearned = lazy(()=>import("../pages/creditsearned"));
const ApplyForms = lazy(()=>import("../pages/applycourse"));
const ApproveCertifications = lazy(()=>import("../pages/overallapprove"));
/**
 * ⚠ These are internal routes!
 * They will be rendered inside the app, using the default `containers/Layout`.
 * If you want to add a route to, let's say, a landing page, you should add
 * it to the `App`'s router, exactly like `Login`, `CreateAccount` and other pages
 * are routed.
 *
 * If you're looking for the links rendered in the SidebarContent, go to
 * `routes/sidebar.js`
 */
const routes = [
  {
    path: "/dashboard", // the url
    component: Dashboard, // view rendered
  },
  {
    path: "/applycourse", // the url
    component: ApplyForms, // view rendered
  },
  {
    path: "/creditsearned",
    component: creditsearned,
  },
  {
    path: "/mycourse",
    component: MyCourse,
  },
  {
    path:"/approvecourse",
    component:ApproveCertifications,
  },
  {
    path: "/assignedcourses",
    component: Assignedcourse,
  },
  {
    path: "/coursemaster",
    component: Assignedcourse,
  },
  {
    path: "/studentmasters",
    component: StudentMaster,
  }
  
];

export default routes;
