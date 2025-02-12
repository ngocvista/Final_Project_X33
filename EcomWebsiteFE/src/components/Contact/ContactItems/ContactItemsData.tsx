import { IContactItems } from "../../../types/types";

// contact items text
const contactDirectlyText = (
  <>
    bebu9x98@gmail.com
    <br />
    (+84) 835-778-789
  </>
);

const headQuaterText = (
  <>101 P. Trần Đại Nghĩa, Bách Khoa, Hai Bà Trưng, Hà Nội, Việt Nam</>
);

const workWithUsText = (
  <>
    Gửi CV của bạn đến email:
    <br />
    bebu9x98@gmail.com
  </>
);

const customerServiceText = (
  <>
    bebu9x98@gmail.com
    <br />
    (+84) 835-778-789
  </>
);

const mediaRelationsText = (
  <>
    bebu9x98@gmail.com
    <br />
    (+84) 835-778-789
  </>
);

const vendorSupportText = (
  <>
    bebu9x98@gmail.com
    <br />
    (+84) 835-778-789
  </>
);

// contact items data
export const ContactItemsData: IContactItems[] = [
  {
    id: 1,
    title: "Liên hệ trực tiếp",
    content: contactDirectlyText,
  },
  {
    id: 2,
    title: "Chi nhánh chính",
    content: headQuaterText,
  },
  {
    id: 3,
    title: "Cộng tác với chúng tôi",
    content: workWithUsText,
  },
  {
    id: 4,
    title: "Dịch vụ khách hàng",
    content: customerServiceText,
  },
  {
    id: 5,
    title: "Quan hệ truyền thông",
    content: mediaRelationsText,
  },
  {
    id: 6,
    title: "Hỗ trợ đối tác",
    content: vendorSupportText,
  },
];
