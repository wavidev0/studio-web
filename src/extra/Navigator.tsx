import { Tooltip } from "@mui/material";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { IconChevronRight, IconPoint } from "@tabler/icons-react";
import { useRouter } from 'next/router';

const Navigator = (props: any) => {
  const location = usePathname();
  const router = useRouter();

  const {
    name, path, navIcon, onClick, navSVG, navIconImg, key,
    activeArrList, liClass, path2
  } = props;

  return (
    <ul className="mainMenu">
      <li onClick={onClick} className={liClass}>
        <Tooltip title={name} placement="right">
          <Link href={{ pathname: path }}
            // to={{ pathname: path }}
            // className={`${location.pathname === path ? location.pathname === path && "activeMenu" : location.pathname === path2 && "activeMenu"}`}
            className={activeArrList?.includes(location) ? "activeMenu" : ""}
          >
            <div>
              {navIcon}
              <span className="text-capitalize">{name}</span>
            </div>

            {props?.children && <IconChevronRight />}
          </Link>
        </Tooltip>
        {/* If Submenu */}
        <ul className={`subMenu transform0`}>
          {props?.children?.map((res) => {
            const { subName, name, path, onClick } = res?.props;
            return (
              <>
                <Tooltip title={name} placement="right">
                  <li>
                    <Link
                      // onClick={() => router.push(path)}
                      href={{ pathname: path }}
                      className={`${location === path && "activeMenu"
                        }`}
                      onClick={onClick}
                    >
                      <IconPoint />
                      <span style={{ fontSize: "14px" }}>{name}</span>
                    </Link>
                  </li>
                </Tooltip>
              </>
            );
          })}
        </ul>
      </li>
    </ul>
  );
};

export default Navigator;
