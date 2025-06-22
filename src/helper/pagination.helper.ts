// import { Document, Model } from "mongoose";

// interface PaginationQuery {
//   page?: string;
//   limit?: string;
//   search?: string;
// }

// interface PaginationResult<T> {
//   data: T[];
//   pagination: {
//     currentPage: number;
//     totalPages: number;
//     totalItems: number;
//     itemsPerPage: number;
//     hasNextPage: boolean;
//     hasPrevPage: boolean;
//   };
// }

// export const getPaginatedResults = async <T extends Document>(
//   model: Model<T>,
//   query: PaginationQuery,
//   searchFields: string[] = []
// ): Promise<PaginationResult<T>> => {
//   const page = parseInt(query.page || "1");
//   const limit = parseInt(query.limit || "10");
//   const search = query.search?.trim();

//   // Build search filter
//   let filter: any = {};
//   if (search && searchFields.length > 0) {
//     filter.$or = searchFields.map((field) => ({
//       [field]: { $regex: search, $options: "i" },
//     }));
//   }

//   // Get total count
//   const totalItems = await model.countDocuments(filter);
//   const totalPages = Math.ceil(totalItems / limit);
//   const skip = (page - 1) * limit;

//   // Get paginated data
//   const data: any = await model
//     .find(filter)
//     .sort({ createdAt: -1 })
//     .skip(skip)
//     .limit(limit)
//     .lean();

//   return {
//     data,
//     pagination: {
//       currentPage: page,
//       totalPages,
//       totalItems,
//       itemsPerPage: limit,
//       hasNextPage: page < totalPages,
//       hasPrevPage: page > 1,
//     },
//   };
// };

import { Document, Model } from "mongoose";

interface PaginationQuery {
  page?: string;
  limit?: string;
  search?: string;
}

interface PaginationResult<T> {
  data: T[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

export const getPaginatedResults = async <T extends Document>(
  model: Model<T>,
  query: PaginationQuery,
  searchFields: string[] = [],
  additionalFilters: any = {}
): Promise<PaginationResult<T>> => {
  const page = parseInt(query.page || "1");
  const limit = parseInt(query.limit || "10");
  const search = query.search?.trim();

  // Build search filter
  let filter: any = { ...additionalFilters };

  if (search && searchFields.length > 0) {
    const searchFilter = {
      $or: searchFields.map((field) => ({
        [field]: { $regex: search, $options: "i" },
      })),
    };

    filter = {
      ...additionalFilters,
      ...searchFilter,
    };
  }

  // Get total count
  const totalItems = await model.countDocuments(filter);
  const totalPages = Math.ceil(totalItems / limit);
  const skip = (page - 1) * limit;

  // Get paginated data
  const data: any = await model
    .find(filter)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .lean();

  return {
    data,
    pagination: {
      currentPage: page,
      totalPages,
      totalItems,
      itemsPerPage: limit,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
    },
  };
};
