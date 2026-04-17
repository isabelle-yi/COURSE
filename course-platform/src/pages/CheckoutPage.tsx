import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Button, List, Typography, Divider, message } from 'antd';
import { useCartStore } from '../store/useCartStore';
import { useOrderStore } from '../store/useOrderStore';
import { createOrder as createOrderAPI } from '../api/orders';
import type { OrderItem } from '../store/useOrderStore';
import { useAuthStore } from '../store/useAuthStore';
import { getCourseById, updateCourse } from '../api/courses';

const { Title, Text } = Typography;

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore(); 
  const { items, getSelectedTotalPrice, getSelectedCount, removeFromCart } = useCartStore();
  const { createOrder } = useOrderStore();
  
  const [loading, setLoading] = useState(false);

  const selectedItems = items.filter(item => item.selected);
  const totalPrice = getSelectedTotalPrice();
  const selectedCount = getSelectedCount();

 const handleSubmitOrder = async () => {
  if (selectedCount === 0) {
    message.warning('请选择要结算的商品');
    return;
  }

  setLoading(true);

  const orderItems: OrderItem[] = selectedItems.map(item => ({
    courseId: item.courseId,
    title: item.title,
    price: item.price,
    coverImage: item.coverImage,
  }));

  // 创建订单
  createOrder(orderItems, totalPrice);

  // 同步到服务器
  try {
    await createOrderAPI({
      userId: user?.id || 0,
      courseId: selectedItems[0]?.courseId || 0,
      courseTitle: selectedItems[0]?.title || '',
      price: totalPrice,
      createdAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error('同步订单失败:', error);
  }

  // 清空购物车中已购买的商品
  selectedItems.forEach(item => {
    removeFromCart(item.courseId);
  });

  // 更新课程的购买次数
  const updateCoursePurchaseCount = async (courseId: number) => {
    try {
      const course = await getCourseById(courseId);
      const newPurchaseCount = (course.purchaseCount || 0) + 1;
      await updateCourse(courseId, { purchaseCount: newPurchaseCount });
    } catch (error) {
      console.error('更新课程购买次数失败:', error);
    }
  };

  // 更新所有购买课程的购买次数
  for (const item of selectedItems) {
    await updateCoursePurchaseCount(item.courseId);
  }

  setLoading(false);
  
  // 购买成功，跳转到我的学习
  message.success('购买成功！');
  setTimeout(() => {
    navigate('/my-learning');
  }, 500);
};
  if (selectedCount === 0) {
    return (
      <div style={{ padding: '50px', textAlign: 'center' }}>
        <Title level={4}>没有选中任何商品</Title>
        <Button type="primary" onClick={() => navigate('/cart')}>
          返回购物车
        </Button>
      </div>
    );
  }

  return (
    <div style={{ padding: '24px', maxWidth: 800, margin: '0 auto' }}>
      <Title level={2} style={{ marginBottom: 24 }}>确认订单</Title>

      {/* 订单商品列表 */}
      <Card title="订单商品" style={{ marginBottom: 24 }}>
        <List
          dataSource={selectedItems}
          renderItem={(item) => (
            <List.Item>
              <div style={{ display: 'flex', gap: 16, flex: 1 }}>
                <img
                  src={item.coverImage || 'https://via.placeholder.com/60x60?text=No+Image'}
                  alt={item.title}
                  style={{ width: 60, height: 60, objectFit: 'cover', borderRadius: 8 }}
                />
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 500 }}>{item.title}</div>
                  <div style={{ color: '#666', fontSize: 12 }}>{item.instructorName}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ color: '#f50' }}>¥{item.price}</div>
                </div>
              </div>
            </List.Item>
          )}
        />
      </Card>

      {/* 订单摘要 */}
      <Card title="订单摘要">
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
          <span>商品数量：</span>
          <span>{selectedCount} 件</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
          <span>商品总额：</span>
          <span>¥{totalPrice}</span>
        </div>
        <Divider />
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 24 }}>
          <span style={{ fontSize: 18, fontWeight: 500 }}>实付金额：</span>
          <span style={{ fontSize: 24, color: '#f50', fontWeight: 600 }}>¥{totalPrice}</span>
        </div>

        <Button
          type="primary"
          size="large"
          block
          loading={loading}
          onClick={handleSubmitOrder}
        >
          提交订单
        </Button>
      </Card>
    </div>
  );
};

export default CheckoutPage;