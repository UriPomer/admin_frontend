import Swal from "sweetalert2";

export const checkAuthentication = async () => {
  const token = await localStorage.getItem("token");
  if (token) {
    const apiRoutePrefix = process.env.API_ROUTE_PREFIX;
    try {
      const response = await fetch(apiRoutePrefix + `/users` + `/info`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 200 || response.status === 201) {
        const userInfo = await response.json(); // 等待获取 JSON 数据
        //如果user_id和原来的一样，就直接返回true
        if (localStorage.getItem("user_id")) {
          if (localStorage.getItem("user_id") == userInfo.id) {
            return true;
          }
        }

        const responseOrgID = await fetch(
          apiRoutePrefix + `/users` + `/${userInfo.id}` + `/orgs`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const orgs = await responseOrgID.json(); // 等待获取 JSON 数据
        if (orgs.length == 0) {
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "您还没有加入任何组织！",
          });
          return false;
        }

        const orgid = orgs[0].org_id;
        if (orgid == undefined || orgid == null) {
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "您还没有加入任何组织！",
          });
          return true;
        }

        const responseOrgInfo = await fetch(
          apiRoutePrefix + `/orgs` + `/${orgid}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (
          !(responseOrgInfo.status === 200 || responseOrgInfo.status === 201)
        ) {
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "您的组织信息有误！",
          });
          return false;
        }
        const orgInfo = await responseOrgInfo.json(); // 等待获取 JSON 数据
        const orgName = orgInfo.name;
        const orgDesc = orgInfo.desc;
        const orgIcon = orgInfo.icon_url;
        const orgType = orgInfo.type;

        //存入本地localStorage
        localStorage.setItem("user_id", userInfo.id);
        localStorage.setItem("username", userInfo.username);
        localStorage.setItem("org_id", orgid);
        localStorage.setItem("org_name", orgName);
        localStorage.setItem("org_desc", orgDesc);
        localStorage.setItem("org_icon_url", orgIcon);
        localStorage.setItem("org_type", orgType);
        localStorage.setItem("role", orgs[0].role);

        return true;
      } else {
        return false;
      }
    } catch (err) {
      console.error("Login Error:", err);
      return false;
    }
  } else {
    return false;
  }
};
