import { useEffect } from 'react';
import { Button, Result } from 'antd';
import { useNavigate } from 'react-router-dom';

const NotFoundPage = () => {
    const navigate = useNavigate();
    
    useEffect(() => {
        const timer = setTimeout(() => {
            navigate('/');
        },5000);
        
        return () => clearTimeout(timer);
    },[navigate]);

    return (
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '60vh'
        }}>
            <Result
             status="404"
             title="404"
             subTitle="抱歉，您访问的页面不存在"
             extra={
                <Button type="primary" onClick={() => navigate('/')}>
                    返回首页
                </Button>
             }
            />
        </div>
    );
};

export default NotFoundPage;
