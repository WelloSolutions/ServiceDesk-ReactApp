import React, { useMemo, useState, useEffect } from 'react';
import { useTable, usePagination } from 'react-table';
import { fetchData } from '../services/apiService.js';
import { Link, useNavigate } from 'react-router-dom';

const ViewUserList = () => {
  const navigate = useNavigate();
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchContact = async () => {
      try {
        const response = await fetchData('https://v1servicedeskapi.wello.solutions/api/Contact', 'GET');
        setContacts(response.value); // Adjusted for your API's response structure
        setLoading(false);
      } catch (err) {
        setError(err);
        setLoading(false);
      }
    };

    fetchContact();
  }, []);

  const columns = useMemo(
    () => [
      { Header: 'First Name', accessor: 'firstname' },
      { Header: 'Last Name', accessor: 'lastname' },
      { Header: 'Email', accessor: 'email' },
      { Header: 'Tel', accessor: 'mobile' },
    ],
    []
  );

  // Create table instance with pagination
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page, // Use page instead of rows for pagination
    prepareRow,
    canPreviousPage,
    canNextPage,
    pageOptions,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    state: { pageIndex, pageSize },
  } = useTable(
    {
      columns,
      data: contacts,
      initialState: { pageIndex: 0, pageSize: 10 }, // Set initial page size to 10
    },
    usePagination
  );

  if (loading) {
    return <div className="flex items-center justify-center h-screen bg-gray-100">
    <div className="relative">
      <div className="w-20 h-20 border-purple-200 border-2 rounded-full"></div>
      <div className="w-20 h-20 border-purple-700 border-t-2 animate-spin rounded-full absolute left-0 top-0"></div>
    </div>
  </div>;
  }

  if (error) {
    return <div className="text-center mt-10 text-red-600">Error fetching users: {error.message}</div>;
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className='flex'>
        {/* Back Button */}
        <button
          onClick={() => navigate('/')} // Navigate back one step in history
          className="mb-6 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
        >
          {'<'}
        </button>
        <h1 className="text-2xl font-semibold text-gray-800 mb-6 ml-4">Users List</h1>
      </div>

      <nav className="mb-4">
        <Link to="/update-password" className="bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded-md hover:bg-gray-400">
          Password Update
        </Link>
      </nav>

      {/* Table displaying users */}
      <div className="overflow-x-auto">
        <table {...getTableProps()} className="min-w-full divide-y divide-gray-200 border border-gray-300">
          <thead className="bg-gray-100">
            {headerGroups.map(headerGroup => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map(column => (
                  <th {...column.getHeaderProps()} className="px-4 py-2 text-left text-sm font-semibold text-gray-600">
                    {column.render('Header')}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody {...getTableBodyProps()} className="bg-white divide-y divide-gray-200">
            {page.map(row => { // Change from rows to page
              prepareRow(row);
              return (
                <tr {...row.getRowProps()} className="hover:bg-gray-50">
                  {row.cells.map(cell => (
                    <td {...cell.getCellProps()} className="px-4 py-2 text-sm text-gray-800">
                      {cell.render('Cell')}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Show pagination controls only if there are more than 10 records */}
      {contacts.length > 10 && (
        <div className="flex items-center justify-between mt-4">
          <span className="text-sm text-gray-700">
            Page {pageIndex + 1} of {pageOptions.length}
          </span>
          <div>
            <button onClick={() => gotoPage(0)} disabled={!canPreviousPage} className="py-2 px-4 mr-2 bg-indigo-600 text-white rounded-md disabled:bg-gray-300">
              {'<<'}
            </button>
            <button onClick={() => previousPage()} disabled={!canPreviousPage} className="py-2 px-4 mr-2 bg-indigo-600 text-white rounded-md disabled:bg-gray-300">
              {'<'}
            </button>
            <button onClick={() => nextPage()} disabled={!canNextPage} className="py-2 px-4 mr-2 bg-indigo-600 text-white rounded-md disabled:bg-gray-300">
              {'>'}
            </button>
            <button onClick={() => gotoPage(pageOptions.length - 1)} disabled={!canNextPage} className="py-2 px-4 bg-indigo-600 text-white rounded-md disabled:bg-gray-300">
              {'>>'}
            </button>
          </div>
          <select value={pageSize} onChange={e => setPageSize(Number(e.target.value))} className="ml-2 p-2 border border-gray-300 rounded-md">
            {[5, 10, 20, 30, 50].map(size => (
              <option key={size} value={size}>
                Show {size}
              </option>
            ))}
          </select>
        </div>
      )}
    </div>
  );
};

export default ViewUserList;