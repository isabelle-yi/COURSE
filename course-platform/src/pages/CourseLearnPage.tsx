import { useParams, useSearchParams } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import { getCourseById } from '../api/courses';
import { getCourseProgress, setCourseProgress, getLastWatchedChapter, setLastWatchedChapter } from '../utils/progress';
import { Card, List, Button, message, Select } from 'antd';
import { PlayCircleOutlined } from '@ant-design/icons';
import { useAuthStore } from '../store/useAuthStore';
import { getOrdersByUser } from '../api/orders';

const CourseLearnPage = () => {
    const { id } = useParams();
    const [searchParams] = useSearchParams();
    const chapterFromUrl = parseInt(searchParams.get('chapter') || '0');
    const sectionFromUrl = parseInt(searchParams.get('section') || '0');

    const [course, setCourse] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [currentChapter, setCurrentChapter] = useState(chapterFromUrl);
    const [currentSection, setCurrentSection] = useState(sectionFromUrl);
    const [playbackRate, setPlaybackRate] = useState(1);
    const videoRef = useRef<HTMLVideoElement>(null);
    const { user } = useAuthStore();
    const [isPurchased, setIsPurchased] = useState(false);

    useEffect(() => {
        if (id) {
            getCourseById(Number(id)).then(data => {
                setCourse(data);
                setLoading(false);
            });
        }
    }, [id]);

    useEffect(() => {
        if (!loading && course) {
            const lastWatched = getLastWatchedChapter(Number(id));
            if (lastWatched && !searchParams.get('chapter')) {
                setCurrentChapter(lastWatched.chapterIndex);
                setCurrentSection(lastWatched.sectionIndex);
            }
        }
    }, [loading, course, id, searchParams]);

    useEffect(() => {
        if (user && id) {
            getOrdersByUser(user.id).then(orders => {
                const purchased = orders.some(order => order.courseId === Number(id));
                setIsPurchased(purchased);
            });
        }
    },[user, id])

    const handleTimeUpdate = () => {
        if (videoRef.current) {
            const progress = (videoRef.current.currentTime / videoRef.current.duration) * 100;
            setCourseProgress(Number(id), progress);
        }
    };

    const handleLoadedMetadata = () => {
        const savedProgress = getCourseProgress(Number(id));
        if (savedProgress > 0 && videoRef.current) {
            videoRef.current.currentTime = (savedProgress / 100) * videoRef.current.duration;
        }
        if (videoRef.current) {
            videoRef.current.playbackRate = playbackRate;
        }
    };

    const handleRateChange = (rate: number) => {
        setPlaybackRate(rate);
        if (videoRef.current) {
            videoRef.current.playbackRate = rate;
        }
    };

    if (loading) return <div>加载中...</div>;
    if (!course) return <div>课程不存在</div>;

    const chapters = course.chapters || [];
    const currentVideo = chapters[currentChapter]?.sections[currentSection];

    if (!currentVideo) {
        return <div style={{ padding: 50, textAlign: 'center' }}>视频不存在</div>;
    }
    
    return (
        <div style={{ padding: '24px',maxWidth: 1400, margin: '0 auto' }}>
            <h1 style={{ marginBottom: 24 }}>{course.title}</h1>
            <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap'}}>
                {/*左侧章节列表*/}
                <div style={{ width: 320, flexShrink: 0 }}>
                    <Card title="课程章节" style={{ height: 'calc(100vh - 200px)', overflowY:'auto' }}>
                       {chapters.map((chapter: any, chapIdx: number) => (
                        <div key={chapIdx} style={{ marginBottom: 16}}>
                            <div style={{ fontWeight: 'bold', marginBottom: 8}}>{chapter.chapterTitle}</div>
                            <List 
                               size="small"
                               dataSource={chapter.sections}
                               renderItem={(section: any, secIdx: number) => {
                                const isFree = section.isFree || false;
                                const canWatch = isPurchased || isFree;

                                return(
                                <List.Item
                                  style={{
                                    cursor: canWatch ? 'pointer' : 'not-allowed',
                                    background: currentChapter === chapIdx && currentSection ===secIdx ? '#e6f7ff' : 'transparent',
                                    padding: '8px 12px',
                                    opacity: canWatch ? 1: 0.6,
                                    justifyContent: 'space-between',
                                    alignItems: 'center'
                                  }}
                                  onClick={() => {
                                    if (canWatch) {
                                    setCurrentChapter(chapIdx);
                                    setCurrentSection(secIdx);
                                    setLastWatchedChapter(Number(id), chapIdx, secIdx);
                                   } else {
                                    message.warning('请先购买课程');
                                   }
                                  }}
                                >
                                   <div style={{ display: 'flex', alignItems: 'center'}}>
                                      <PlayCircleOutlined style={{ marginRight: 8, color:'#1890ff' }}/>
                                      <span>{section.title}</span>
                                   </div>

                                   <div>
                                       {!canWatch && <span style={{ color: '#ccc'}}>🔒</span>}
                                       {isFree && !isPurchased && (
                                        <span style={{ color: 'green', fontSize: 12}}>试听</span>
                                       )}
                                   </div>
                                </List.Item>
                                );
                               }}
                            />
                        </div>
                       ))}
                    </Card>
                </div>

                {/*右侧视频播放区域*/}
                <div style={{ flex: 1, minWidth: 300}}>
                   <video
                      ref={videoRef}
                      src={currentVideo.videoUrl}
                      controls
                      style={{ width: '100%',borderRadius: '8px'}}
                      onTimeUpdate={handleTimeUpdate}
                      onLoadedMetadata={handleLoadedMetadata}
                   />

                   <div style={{ marginTop: 16 }}>
                       <h2>{currentVideo.title}</h2>
                       <div style={{ margin: 12, display: 'flex',gap: '16px', alignItems: 'center'}}>
                           <span>播放速度：</span>
                           <Select
                              value={playbackRate}
                              onChange={handleRateChange}
                              style={{ width: 100 }}
                              options={[
                                { value: 0.75,label: '0.75x' },
                                { value: 1,label: '1x' },
                                { value: 1.25,label: '1.25x' },
                                { value: 1.5,label: '1.5x' },
                                { value: 2,label: '2x' },
                              ]}
                           />
                       </div>
                   </div>
                </div>
            </div>
        </div>
    );
};

export default CourseLearnPage;