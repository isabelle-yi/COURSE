import { Breadcrumb } from 'antd';
import { Link, useLocation } from 'react-router-dom';

const AppBreadcrumb = () => {
    const location = useLocation();
    const pathnames = location.pathname.split('/').filter(x => x);
 
    const nameMap: Record<string, string> = {
        'courses': '课程广场',
        'course': '课程详情',
        'my-learning': '我的学习',
        'profile': '个人中心',
        'login': '登录',
        'instructor': '讲师中心',
        'admin': '管理中心',
    };

    if (pathnames.length === 0) return null;
    
   const breadcrumbItems: {title: string | JSX.Element }[]= [
    { title:<Link to="/">首页</Link>},
   ];

   for (let i=0; i<pathnames.length;i++){
    const name = pathnames[i];
    const isLast = i === pathnames.length -1;
    const routeTo = `/${pathnames.slice(0, i+1).join('/')}`;
    const displayName = nameMap[name] || decodeURIComponent(name);

    if(name === 'course' && !isLast) continue;

    breadcrumbItems.push({
        title: (name === 'course' && isLast)
        ? '课程详情'
        :(isLast? displayName:<Link to={routeTo}>{displayName}</Link>),
     });
   }
    
    return(
    <Breadcrumb
       style={{ marginBottom: '16px', padding: '0 24px'}}
       items={breadcrumbItems}
    />
   );
};

export default AppBreadcrumb;