import { TodoApp } from "@/components/TodoApp";
import styles from "@/styles/app.module.css";

export default function Home() {
  return (
    <main className={styles.main}>
      <TodoApp />
    </main>
  );
}