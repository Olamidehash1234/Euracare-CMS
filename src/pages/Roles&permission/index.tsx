import Header from '../../components/commonComponents/Header';
import SearchBar from '../../components/commonComponents/SearchBar';
import NotFound from '../../components/commonComponents/NotFound';

const DepartmentPage = () => (
  <div>
    <section>
      <Header title="Roles & Permission" />
      <div className="p-[16px] lg:p-[40px]">
        <div className="bg-white rounded-[14px] p-6 lg:px-[20px] lg:py-[23px] shadow-sm border border-gray-200">
          <div className="flex items-center flex-col lg:flex-row gap-[20px] justify-between mb-[22px]">
            <button className="flex items-center order-1 lg:order-2 ml-auto lg:ml-0 lg:w-auto gap-2 px-6 py-[9px] lg:py-[13px] lg:px-[20px] rounded-full bg-[#0C2141] text-white text-sm font-medium">
              <span className="text-lg">+</span> Create Roles
            </button>

            <div className="flex items-center w-full lg:w-1/2 order-2 lg:order-1">
              <SearchBar placeholder="Search Here" />
            </div>
          </div>

            <NotFound
              title="Nothing to see here"
              description={`It looks like you haven’t defined any roles and permission yet. Once Added, they’ll appear here for you to manage.`}
              imageSrc="/not-found.png"
              ctaText="Create Roles"
            />
        </div>
      </div>
    </section>
  </div>
);

export default DepartmentPage;
