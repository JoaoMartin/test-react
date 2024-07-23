import React, { useState } from 'react';
import { User } from '../../interfaces/User';
import { SortKey } from '../../interfaces/SortKey';
import styles from './TableComponent.module.css';

interface TableComponentProps {
  users: User[];
  onUserSelect: (userId: string, selected: boolean) => void;
}

const TableComponent: React.FC<TableComponentProps> = ({ users, onUserSelect }) => {
  const [sortConfig, setSortConfig] = useState<{ key: SortKey | '', direction: 'ascending' | 'descending' | '' }>({ key: '', direction: '' });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 7;

  const getValue = (user: User, key: SortKey) => {
    return key.split('.').reduce((obj, k) => (obj as any)[k], user);
  };

  const sortedUsers = [...users].sort((a, b) => {
    if (sortConfig.key === '') return 0;

    const aValue = getValue(a, sortConfig.key);
    const bValue = getValue(b, sortConfig.key);

    if (aValue < bValue) {
      return sortConfig.direction === 'ascending' ? -1 : 1;
    }
    if (aValue > bValue) {
      return sortConfig.direction === 'ascending' ? 1 : -1;
    }
    return 0;
  });

  const paginatedUsers = sortedUsers.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const requestSort = (key: SortKey) => {
    let direction: 'ascending' | 'descending' = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const getClassNamesFor = (name: SortKey) => {
    if (!sortConfig.key || sortConfig.key !== name) {
      return '';
    }
    return sortConfig.direction === 'ascending' ? styles.sortedAscending : styles.sortedDescending;
  };

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < Math.ceil(users.length / itemsPerPage)) {
      setCurrentPage(currentPage + 1);
    }
  };

  return (
    <div>
      <table className={styles.table}>
        <thead>
          <tr>
            <th></th>
            <th></th>
            <th onClick={() => requestSort('name.first')} className={getClassNamesFor('name.first')}>
              <span className={styles.sortIcons}>▲▼</span>Nombre
            </th>
            <th onClick={() => requestSort('gender')} className={getClassNamesFor('gender')}>
              <span className={styles.sortIcons}>▲▼</span>Género
            </th>
            <th onClick={() => requestSort('location.street.name')} className={getClassNamesFor('location.street.name')}>
              <span className={styles.sortIcons}>▲▼</span>Dirección
            </th>
            <th onClick={() => requestSort('phone')} className={getClassNamesFor('phone')}>
              <span className={styles.sortIcons}>▲▼</span>Teléfono
            </th>
            <th onClick={() => requestSort('email')} className={getClassNamesFor('email')}>
              <span className={styles.sortIcons}>▲▼</span>Correo electrónico
            </th>
            <th onClick={() => requestSort('location.country')} className={getClassNamesFor('location.country')}>
              <span className={styles.sortIcons}>▲▼</span>País
            </th>
          </tr>
        </thead>
        <tbody>
          {paginatedUsers.map(user => (
            <tr key={user.login.uuid}>
              <td>
                <input type="checkbox" onChange={(e) => onUserSelect(user.login.uuid, e.target.checked)} />
              </td>
              <td><img src={user.picture.thumbnail} alt={`${user.name.first} ${user.name.last}`} className={styles.imgThumbnail} /></td>
              <td>{`${user.name.first} ${user.name.last}`}</td>
              <td>{user.gender}</td>
              <td>{user.location.street.name}</td>
              <td>{user.phone}</td>
              <td>{user.email}</td>
              <td>{user.location.country}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className={styles.pagination}>
        <button onClick={handlePreviousPage} disabled={currentPage === 1}>Anterior</button>
        {Array.from({ length: Math.ceil(users.length / itemsPerPage) }, (_, index) => (
          <button
            key={index + 1}
            onClick={() => handlePageChange(index + 1)}
            className={currentPage === index + 1 ? styles.active : ''}
          >
            {index + 1}
          </button>
        ))}
        <button onClick={handleNextPage} disabled={currentPage === Math.ceil(users.length / itemsPerPage)}>Siguiente</button>
      </div>
    </div>
  );
};

export default TableComponent;
