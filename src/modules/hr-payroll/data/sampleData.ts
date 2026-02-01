// Sample data for HR Payroll Dashboard

// Employee Data
export const employeeData = [
  {
    key: '1',
    name: 'John Doe',
    avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
    department: 'IT',
    position: 'Software Engineer',
    status: 'Active',
    salary: '₹85,000',
    joinDate: '2021-05-15',
    attendance: 95,
    performance: 88,
  },
  {
    key: '2',
    name: 'Jane Smith',
    avatar: 'https://randomuser.me/api/portraits/women/2.jpg',
    department: 'HR',
    position: 'HR Manager',
    status: 'Active',
    salary: '₹78,000',
    joinDate: '2020-03-10',
    attendance: 98,
    performance: 92,
  },
  {
    key: '3',
    name: 'Robert Johnson',
    avatar: 'https://randomuser.me/api/portraits/men/3.jpg',
    department: 'Finance',
    position: 'Financial Analyst',
    status: 'Active',
    salary: '₹72,000',
    joinDate: '2022-01-05',
    attendance: 90,
    performance: 85,
  },
  {
    key: '4',
    name: 'Emily Davis',
    avatar: 'https://randomuser.me/api/portraits/women/4.jpg',
    department: 'Marketing',
    position: 'Marketing Specialist',
    status: 'Inactive',
    salary: '₹68,000',
    joinDate: '2021-08-20',
    attendance: 75,
    performance: 70,
  },
  {
    key: '5',
    name: 'Michael Wilson',
    avatar: 'https://randomuser.me/api/portraits/men/5.jpg',
    department: 'Operations',
    position: 'Operations Manager',
    status: 'Active',
    salary: '₹92,000',
    joinDate: '2019-11-15',
    attendance: 97,
    performance: 94,
  },
  {
    key: '6',
    name: 'Sarah Brown',
    avatar: 'https://randomuser.me/api/portraits/women/6.jpg',
    department: 'IT',
    position: 'UI/UX Designer',
    status: 'Active',
    salary: '₹75,000',
    joinDate: '2022-02-28',
    attendance: 92,
    performance: 88,
  },
  {
    key: '7',
    name: 'David Miller',
    avatar: 'https://randomuser.me/api/portraits/men/7.jpg',
    department: 'Finance',
    position: 'Accountant',
    status: 'Active',
    salary: '₹65,000',
    joinDate: '2021-07-10',
    attendance: 94,
    performance: 82,
  },
];

// Department Distribution Data for Pie Chart
export const departmentDistributionData = [
  { name: 'IT', value: 35 },
  { name: 'HR', value: 15 },
  { name: 'Finance', value: 20 },
  { name: 'Marketing', value: 18 },
  { name: 'Operations', value: 12 },
];

// Attendance Overview Data for Bar Chart
export const attendanceData = [
  { month: 'Jan', present: 22, absent: 1, leave: 2 },
  { month: 'Feb', present: 20, absent: 0, leave: 0 },
  { month: 'Mar', present: 21, absent: 1, leave: 1 },
  { month: 'Apr', present: 19, absent: 2, leave: 1 },
  { month: 'May', present: 22, absent: 0, leave: 0 },
  { month: 'Jun', present: 20, absent: 1, leave: 1 },
];

// Salary Distribution Data for Bar Chart
export const salaryDistributionData = [
  { range: '₹40k-₹50k', count: 5 },
  { range: '₹50k-₹60k', count: 8 },
  { range: '₹60k-₹70k', count: 12 },  { range: '₹70k-₹80k', count: 15 },
  { range: '₹80k-₹90k', count: 10 },
  { range: '₹90k-₹100k', count: 7 },
  { range: '₹100k+', count: 4 },
];

// Monthly Hiring Trends Data for Composed Chart
export const hiringData = [
  { month: 'Jan', hired: 5, open: 8, applications: 45 },
  { month: 'Feb', hired: 7, open: 10, applications: 55 },
  { month: 'Mar', hired: 4, open: 6, applications: 35 },
  { month: 'Apr', hired: 8, open: 12, applications: 65 },
  { month: 'May', hired: 10, open: 15, applications: 80 },
  { month: 'Jun', hired: 6, open: 9, applications: 50 },
];

// Recent Activities Data for List
export const recentActivities = [
  {
    user: 'Jane Smith',
    avatar: 'https://randomuser.me/api/portraits/women/2.jpg',
    action: 'approved leave request for',
    target: 'David Miller',
    time: '2 hours ago',
  },
  {
    user: 'Michael Wilson',
    avatar: 'https://randomuser.me/api/portraits/men/5.jpg',
    action: 'updated salary for',
    target: 'Sarah Brown',
    time: '4 hours ago',
  },
  {
    user: 'John Doe',
    avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
    action: 'added new employee',
    target: 'Robert Johnson',
    time: 'Yesterday',
  },
  {
    user: 'Emily Davis',
    avatar: 'https://randomuser.me/api/portraits/women/4.jpg',
    action: 'posted new job opening for',
    target: 'Marketing Specialist',
    time: '2 days ago',
  },
];

// Leave Requests Data for Table
export const leaveRequestsData = [
  {
    key: '1',
    employee: 'John Doe',
    avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
    leaveType: 'Sick Leave',
    startDate: '2023-07-10',
    endDate: '2023-07-12',
    duration: '3 days',
    status: 'Pending',
  },
  {
    key: '2',
    employee: 'Jane Smith',
    avatar: 'https://randomuser.me/api/portraits/women/2.jpg',
    leaveType: 'Vacation',
    startDate: '2023-08-05',
    endDate: '2023-08-15',
    duration: '11 days',
    status: 'Approved',
  },
  {
    key: '3',
    employee: 'Robert Johnson',
    avatar: 'https://randomuser.me/api/portraits/men/3.jpg',
    leaveType: 'Personal Leave',
    startDate: '2023-07-20',
    endDate: '2023-07-21',
    duration: '2 days',
    status: 'Pending',
  },
  {
    key: '4',
    employee: 'Sarah Brown',
    avatar: 'https://randomuser.me/api/portraits/women/6.jpg',
    leaveType: 'Sick Leave',
    startDate: '2023-07-15',
    endDate: '2023-07-15',
    duration: '1 day',
    status: 'Pending',
  },
];

// Job Openings Data for Table
export const jobOpeningsData = [
  {
    key: '1',
    position: 'Senior Software Engineer',
    department: 'IT',
    location: 'New York, NY',
    openings: 2,
    postedDate: '2023-06-15',
    applications: 45,
  },
  {
    key: '2',
    position: 'HR Coordinator',
    department: 'HR',
    location: 'Chicago, IL',
    openings: 1,
    postedDate: '2023-06-20',
    applications: 28,
  },
  {
    key: '3',
    position: 'Marketing Manager',
    department: 'Marketing',
    location: 'San Francisco, CA',
    openings: 1,
    postedDate: '2023-06-25',
    applications: 32,
  },
];

// Upcoming Events Data for List
export const upcomingEvents = [
  {
    key: '1',
    title: 'Team Building Workshop',
    date: 'July 15, 2023',
    location: 'Conference Room A',
    participants: 'All Departments',
  },
  {
    key: '2',
    title: 'New Employee Orientation',
    date: 'July 20, 2023',
    location: 'Training Room',
    participants: 'HR, New Hires',
  },
  {
    key: '3',
    title: 'Quarterly Performance Review',
    date: 'July 25-28, 2023',
    location: 'Meeting Rooms',
    participants: 'All Employees',
  },
];