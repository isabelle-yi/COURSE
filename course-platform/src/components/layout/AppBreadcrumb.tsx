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
    
    return (
        <Breadcrumb style={{ marginBottom: '16px', padding: '0 24px'}}>
            <Breadcrumb.Item>
            <Link to="/">首页</Link>
            </Breadcrumb.Item>
       
        {pathnames.map((name, index) => {
            const routeTo = `/${pathnames.slice(0, index + 1).join('/')}`;
            const isLast = index === pathnames.length - 1;
            const displayName = nameMap[name] || decodeURIComponent(name);

            if(name === 'course' && !isLast) return null;
            if(name === 'course' && isLast){
                return (
                    <Breadcrumb.Item key={routeTo}>
                        课程详情
                    </Breadcrumb.Item>
                );
            }

            return (
                <Breadcrumb.Item key={routeTo}>
                    {isLast ? displayName : <Link to={routeTo}>{displayName}</Link>}
                </Breadcrumb.Item>
            )
        })}
         </Breadcrumb>
    );

};

export default AppBreadcrumb;