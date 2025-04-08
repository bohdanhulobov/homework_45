import { List } from "antd";
import CourseCard from "./CourseCard";

export default function CoursesList({ items, onEdit, onDelete }) {
  return (
    <List
      grid={{ gutter: 16, column: 1 }}
      dataSource={items}
      renderItem={(item) => (
        <List.Item>
          <CourseCard
            key={item.id}
            onEdit={onEdit}
            onDelete={onDelete}
            {...item}
          />
        </List.Item>
      )}
    />
  );
}
