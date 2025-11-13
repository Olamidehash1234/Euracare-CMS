import Header from "../../components/commonComponents/Header";
import ServicesCard from '../../components/Overview/ServicesCard';
import BlogCard from '../../components/Overview/BlogCard';
import DoctorsCard from '../../components/Overview/DoctorsCard';
import RecentActivityCard from '../../components/Overview/RecentActivityCard';

const OverviewPage = () => (
  <div>
    <Header title="Overview" />
    <div className="p-[16px] lg:px-[40px] lg:py-[50px]">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-[20px] ">
        <ServicesCard />
        <BlogCard />
        <DoctorsCard />
        <RecentActivityCard />
      </div>
    </div>
  </div>
);

export default OverviewPage;
