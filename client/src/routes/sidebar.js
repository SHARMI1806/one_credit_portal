const role = sessionStorage.getItem("role"); // Ensure to pass the key as a string

let routes = [];
switch (role) {
  case "1":
    routes = [
      {
        path: "/app/dashboard", // the url
        icon: "HomeIcon", // the component being exported from icons/index.js
        name: "Home Page", // name that appear in Sidebar
      },
      {
        path: "/app/studentmasters",
        icon: "FaUsers",
        name: "StudentMaster",
      },
      {
        path: "/app/creditsearned",
        icon: "GiReceiveMoney",
        name: "Credits Earned",
      },
      // {
      //   path: "/app/applycourse",
      //   icon: "FormsIcon",
      //   name: "Apply Course",
      // },
      {
        path: "/app/approvecourse",
        icon: "SiCoursera",
        name: "Approve Course",
      },
      {
        path: "/app/mycourse",
        icon: "SiCoursera",
        name: "Completed Course",
      },
      // {
      //   path: "/app/coursemaster",
      //   icon: "SiCoursera",
      //   name: "Course Master",
      // },
    ];
    break;
  case "2":
    {
      routes = [
        {
          path: "/app/dashboard", // the url
          icon: "HomeIcon", // the component being exported from icons/index.js
          name: "Home Page", // name that appear in Sidebar
        },
        {
          path: "/app/applycourse",
          icon: "FormsIcon",
          name: "Apply Course",
        },
        {
          path: "/app/approvecourse",
          icon: "SiCoursera",
          name: "Approve Course",
        },
        {
          path: "/app/mycourse",
          icon: "SiCoursera",
          name: "Completed Course",
        },
        {
          path: "/app/creditsearned",
          icon: "GiReceiveMoney",
          name: "Credits Earned",
        },
      ];
    }
    break;
  default:
    // Default routes for unknown or unauthorized users
    routes = [
      {
        path: "/login",
        icon: "LoginIcon",
        name: "Login",
      },
    ];
    break;
}
export default routes;
