import { Table, Button, InputNumber, Empty, Checkbox, Card, Divider } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import { useCartStore } from '../store/useCartStore';
import { useNavigate } from 'react-router-dom';
import { message } from 'antd';

const CartPage = () => {
    const navigate = useNavigate();
    const {
        items,
        removeFromCart,
        updateQuantity,
        toggleSelect,
        toggleSelectAll,
        getSelectedTotalPrice,
        getSelectedCount
    } = useCartStore();
    const selectedTotalPrice = getSelectedTotalPrice();
    const selectedCount = getSelectedCount();
    const allSelected = items.length > 0 && items.every(item => item.selected);

    const columns = [
        {
            title: '选择',
            key: 'select',
            width: 60,
            render: (_: any, record: any) => (
                <Checkbox
                   checked={record.selected}
                   onChange={() => toggleSelect(record.courseId)}
                />
              )
            },
            {
                title: '课程信息',
                key: 'course',
                render: (_: any, record: any) => (
                    <div style={{ display: 'flex', gap: 16 }}>
                        <img
                           src={record.coverImage || 'https://via.placeHolder.com/80x60?text=No+Image'}
                           alt={record.title}
                           style={{ width: 80,height: 60, objectFit: 'cover', borderRadius: 8}}
                        />
                        <div>
                            <div style={{ fontWeight: 500 }}>{record.title}</div>
                            <div style={{ color: '#666', fontSize: 12}}>{record.instructorName}</div>
                        </div>
                    </div>
                )
            },
            {
                title: '单价',
                key: 'price',
                width: 120,
                render: (_: any, record: any) => <span>¥{record.price}</span>   
            },
            {
                title: '数量',
                key: 'quantity',
                width: 150,
                render: (_: any, record: any)=> (
                    <InputNumber
                       min={1}
                       value={record.quantity}
                       onChange={(value) => updateQuantity(record.courseId, value || 1)}
                    />
                )
            },
            {
                title: '小计',
                key: 'subtotal',
                width: 120,
                render: (_: any, record: any) => <span>¥{record.price * record.quantity}</span> 
            },
            {
                title: '操作',
                key: 'action',
                width: 80,
                render: (_:any, record: any) => (
                    <Button
                      type="text"
                      danger
                      icon={<DeleteOutlined />}
                      onClick={() => removeFromCart(record.courseId)}
                    />
                )
            }   
    ];
        
    if(items.length === 0){
        return (
            <div style={{ padding:'50px', textAlign: 'center'}}>
                <Empty description="购物车空空如也" />
                <Button type="primary" onClick={() => navigate('/courses')} style={{marginTop: 16}}>
                    去逛逛
                </Button>
            </div>
        )
    }
        return (
            <div style={{ padding: '24px'}}>
                <h1 style={{ fontSize: 24, marginBottom: 24}}>购物车</h1>

                <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap'}}>
                    <div style={{ flex: 2, minWidth: 300}}>
                        <Table
                           columns={columns}
                           dataSource={items}
                           rowKey="courseId"
                           pagination={false}
                        />
                        <div>
                            <Checkbox
                              checked={allSelected}
                              onChange={(e) => toggleSelectAll(e.target.checked)}
                            >
                                全选
                            </Checkbox>
                        </div>
                    </div>

                    <div style={{ flex: 1,minWidth: 260 }}>
                        <Card title="订单摘要">
                           <div style={{ display: 'flex',justifyContent: 'space-between', marginBottom: 12}}>
                               <span>商品数量：</span>
                               <span>{selectedCount}件</span>
                           </div>
                           <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12}}>
                               <span>合计金额：</span>
                               <span style={{ fontSize: 24,color: '#f50', fontWeight: 600}}>
                                 ¥{selectedTotalPrice}
                               </span>
                           </div>
                           <Divider/>
                           <Button
                            type="primary"
                            size="large"
                            block
                            disabled={selectedCount ===0}
                            onClick={() => {
                                if (selectedCount ===0)
                                {
                                    message.warning('请选择要结算的商品');
                                    return;
                                }
                                navigate('/checkout')
                            }}
                           >
                               去结算 ({selectedCount})
                           </Button>
                        </Card>
                    </div>
                </div>
            </div>
        );
    
};

export default CartPage;

