import React, { useState } from 'react';
import { 
  Row, 
  Col, 
  Card, 
  Calendar,
  Badge, 
  Button, 
  Typography, 
  List, 
  Tag,
  Avatar,
  Tooltip,
  Space,
  Empty
} from 'antd';
import { 
  PlusOutlined, 
  CalendarOutlined, 
  TeamOutlined, 
  EnvironmentOutlined, 
  ClockCircleOutlined
} from '@ant-design/icons';
import dayjs, { Dayjs } from 'dayjs';

const { Title, Text } = Typography;

// Sample events data
const eventsData = [
  {
    id: 1,
    title: 'Team Building Event',
    type: 'Company',
    date: '2025-06-20',
    time: '10:00 AM - 06:00 PM',
    location: 'City Park Resort',
    description: 'Annual team building event to promote collaboration and team spirit.',
    participants: ['John Doe', 'Jane Smith', 'Robert Johnson', 'Emily Wilson', 'James Brown'],
    status: 'Upcoming',
  },
  {
    id: 2,
    title: 'Quarterly Review Meeting',
    type: 'Department',
    date: '2025-06-18',
    time: '02:00 PM - 04:00 PM',
    location: 'Conference Room A',
    description: 'Quarterly performance review meeting with all department heads.',
    participants: ['Jane Smith', 'Michael Clark', 'Robert Johnson'],
    status: 'Upcoming',
  },
  {
    id: 3,
    title: 'New Hire Orientation',
    type: 'HR',
    date: '2025-06-16',
    time: '09:00 AM - 11:30 AM',
    location: 'Training Room B',
    description: 'Orientation program for new employees joining this month.',
    participants: ['Emily Wilson', 'New Employees'],
    status: 'Upcoming',
  },
  {
    id: 4,
    title: 'Project Kickoff',
    type: 'Project',
    date: '2025-06-15',
    time: '11:00 AM - 12:30 PM',
    location: 'Meeting Room C',
    description: 'Kickoff meeting for the new ERP implementation project.',
    participants: ['John Doe', 'Robert Johnson', 'Sarah Williams', 'Michael Clark'],
    status: 'Today',
  },
  {
    id: 5,
    title: 'Employee Training',
    type: 'Training',
    date: '2025-06-12',
    time: '02:00 PM - 05:00 PM',
    location: 'Training Center',
    description: 'Advanced Excel training for finance and accounting teams.',
    participants: ['Jane Smith', 'Emily Wilson', 'Finance Team'],
    status: 'Completed',
  },
  {
    id: 6,
    title: 'Board Meeting',
    type: 'Executive',
    date: '2025-06-10',
    time: '09:00 AM - 11:00 AM',
    location: 'Executive Boardroom',
    description: 'Monthly board meeting to discuss company progress and strategy.',
    participants: ['John Doe', 'Robert Johnson', 'Board Members'],
    status: 'Completed',
  },
  {
    id: 7,
    title: 'Client Presentation',
    type: 'Sales',
    date: '2025-06-08',
    time: '03:00 PM - 04:30 PM',
    location: 'Client Office',
    description: 'Presentation of new product features to key client.',
    participants: ['Michael Clark', 'Sarah Williams', 'Sales Team'],
    status: 'Completed',
  },
  {
    id: 8,
    title: 'Company Townhall',
    type: 'Company',
    date: '2025-06-30',
    time: '04:00 PM - 05:30 PM',
    location: 'Main Auditorium',
    description: 'Monthly company-wide meeting for updates and Q&A.',
    participants: ['All Employees'],
    status: 'Upcoming',
  },
  {
    id: 9,
    title: 'Strategic Planning',
    type: 'Executive',
    date: '2025-06-25',
    time: '10:00 AM - 03:00 PM',
    location: 'Conference Room A',
    description: 'Annual strategic planning session for the next fiscal year.',
    participants: ['John Doe', 'Jane Smith', 'Department Heads'],
    status: 'Upcoming',
  },
  {
    id: 10,
    title: 'Team Lunch',
    type: 'Department',
    date: '2025-06-22',
    time: '12:30 PM - 02:00 PM',
    location: 'Rooftop Cafe',
    description: 'Team lunch to celebrate project completion.',
    participants: ['Robert Johnson', 'Emily Wilson', 'Project Team'],
    status: 'Upcoming',
  },
];

const getTypeColor = (type: string) => {
  switch(type) {
    case 'Company': return 'blue';
    case 'Department': return 'cyan';
    case 'HR': return 'purple';
    case 'Project': return 'green';
    case 'Training': return 'orange';
    case 'Executive': return 'red';
    case 'Sales': return 'gold';
    default: return 'default';
  }
};

const getStatusColor = (status: string) => {
  switch(status) {
    case 'Upcoming': return 'processing';
    case 'Today': return 'warning';
    case 'Completed': return 'default';
    default: return 'default';
  }
};

interface EventsTabProps {
  showDrawer: (type: string) => void;
}

const EventsTab: React.FC<EventsTabProps> = ({ showDrawer }) => {
  const [selectedDate, setSelectedDate] = useState<Dayjs>(dayjs());
  
  const dateCellRender = (value: Dayjs) => {
    const formattedDate = value.format('YYYY-MM-DD');
    const listData = eventsData.filter(event => event.date === formattedDate);
    
    return (
      <ul className="events-day-list">
        {listData.map(item => (
          <li key={item.id}>
            <Badge color={getTypeColor(item.type)} text={item.title} />
          </li>
        ))}
      </ul>
    );
  };

  const handleDateSelect = (value: Dayjs) => {
    setSelectedDate(value);
  };
  
  const selectedDateEvents = eventsData.filter(
    event => event.date === selectedDate.format('YYYY-MM-DD')
  );

  return (
    <div className="events-tab">
      <Row gutter={[16, 16]}>
        {/* Left Column - Calendar */}
        <Col xs={24} lg={16}>
          <Card 
            bordered={false}
            title={<Title level={5}>Events Calendar</Title>}
            extra={
              <Button 
                type="primary" 
                icon={<PlusOutlined />}
                onClick={() => showDrawer('event')}
              >
                Add Event
              </Button>
            }
            className="calendar-card"
          >
            <Calendar 
              cellRender={dateCellRender} 
              onSelect={handleDateSelect}
              value={selectedDate}
              fullscreen
            />
          </Card>
        </Col>
        
        {/* Right Column - Events for selected date */}
        <Col xs={24} lg={8}>
          <Card 
            bordered={false}
            title={
              <Space>
                <CalendarOutlined />
                <span>Events on {selectedDate.format('MMMM D, YYYY')}</span>
              </Space>
            }
            className="events-list-card"
          >
            {selectedDateEvents.length === 0 ? (
              <Empty 
                image={Empty.PRESENTED_IMAGE_SIMPLE} 
                description="No events scheduled for this date"
              />
            ) : (
              <List
                dataSource={selectedDateEvents}
                renderItem={(item) => (
                  <List.Item
                    key={item.id}
                    actions={[
                      <Button key="view" type="link" onClick={() => showDrawer('event-details')}>
                        View Details
                      </Button>
                    ]}
                  >
                    <List.Item.Meta
                      title={
                        <div>
                          <Text strong>{item.title}</Text>
                          <Tag color={getStatusColor(item.status)} style={{ marginLeft: 8 }}>
                            {item.status}
                          </Tag>
                        </div>
                      }
                      description={
                        <Space direction="vertical" size={2}>
                          <div>
                            <Tag color={getTypeColor(item.type)}>{item.type}</Tag>
                          </div>
                          <div>
                            <ClockCircleOutlined style={{ marginRight: 8 }} /> 
                            {item.time}
                          </div>
                          <div>
                            <EnvironmentOutlined style={{ marginRight: 8 }} /> 
                            {item.location}
                          </div>
                          <div className="participant-avatars">
                            <TeamOutlined style={{ marginRight: 8 }} />
                            <Avatar.Group maxCount={4}>
                              {item.participants.map((participant, index) => (
                                <Tooltip title={participant} key={index}>
                                  <Avatar size="small">
                                    {participant.charAt(0)}
                                  </Avatar>
                                </Tooltip>
                              ))}
                            </Avatar.Group>
                          </div>
                        </Space>
                      }
                    />
                  </List.Item>
                )}
              />
            )}
          </Card>
          
          {/* Upcoming Events */}
          <Card 
            bordered={false}
            title={
              <Space>
                <CalendarOutlined />
                <span>Upcoming Events</span>
              </Space>
            }
            className="upcoming-events-card"
            style={{ marginTop: 16 }}
          >
            <List
              dataSource={eventsData
                .filter(event => event.status === 'Upcoming')
                .slice(0, 4)}
              renderItem={(item) => (
                <List.Item
                  key={item.id}
                >
                  <List.Item.Meta
                    avatar={
                      <Avatar style={{ backgroundColor: getTypeColor(item.type), color: '#fff' }}>
                        {item.type.charAt(0)}
                      </Avatar>
                    }
                    title={<Text strong>{item.title}</Text>}
                    description={
                      <Space>
                        <CalendarOutlined /> {dayjs(item.date).format('MMM D')} | 
                        <ClockCircleOutlined /> {item.time.split(' - ')[0]}
                      </Space>
                    }
                  />
                </List.Item>
              )}
              footer={
                <div style={{ textAlign: 'center' }}>
                  <Button type="link" onClick={() => showDrawer('events-list')}>
                    View All Events
                  </Button>
                </div>
              }
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default EventsTab;
